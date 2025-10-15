from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_mail import Mail, Message
import pymysql
from pymysql.cursors import DictCursor
import os
from dotenv import load_dotenv
import logging
from datetime import timedelta
from functools import wraps

# --- Load environment variables ---
load_dotenv()

# --- Flask app setup ---
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "supersecretkey")
app.permanent_session_lifetime = timedelta(hours=4)

# ✅ Important: allow credentials for session cookies
CORS(app, supports_credentials=True, origins=[
    "https://your-frontend-domain.onrender.com"
])
# --- Configure Flask-Mail ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- MySQL connection setup ---
def get_db_connection():
    try:
        conn = pymysql.connect(
            host=os.getenv("MYSQL_HOST", "127.0.0.1"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
            port=int(os.getenv("MYSQL_PORT", 3306)),
            cursorclass=DictCursor,  # ✅ returns dict-style results
        )
        return conn
    except pymysql.MySQLError as e:
        logger.error(f"MySQL connection failed: {e}")
        return None

# --- Create table if not exists ---
def init_db():
    conn = get_db_connection()
    if not conn:
        logger.error("Database initialization failed: No connection.")
        return

    with conn.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS waitlist_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50),
                beta_tester BOOLEAN DEFAULT FALSE,
                ambassador BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    conn.commit()
    conn.close()
    logger.info("✅ Database initialized successfully.")

# --- Admin auth decorator ---
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("admin_authenticated"):
            return jsonify({"success": False, "message": "Unauthorized access"}), 401
        return f(*args, **kwargs)
    return decorated_function

# --- Routes ---
@app.route('/api/join-waitlist', methods=['POST'])
def join_waitlist():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('name'):
            return jsonify({'success': False, 'message': 'Name and email are required'}), 400

        name = data['name']
        email = data['email']
        phone = data.get('phone', '')
        beta_tester = data.get('betaTester', False)
        ambassador = data.get('ambassador', False)

        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection failed'}), 500

        with conn.cursor() as cursor:
            try:
                cursor.execute("""
                    INSERT INTO waitlist_users (name, email, phone, beta_tester, ambassador)
                    VALUES (%s, %s, %s, %s, %s)
                """, (name, email, phone, beta_tester, ambassador))
                conn.commit()
            except pymysql.err.IntegrityError:
                return jsonify({'success': False, 'message': 'Email already exists in waitlist'}), 400

        send_confirmation_email(name, email)
        logger.info(f"✅ New waitlist signup: {email}")
        return jsonify({'success': True, 'message': 'Successfully joined waitlist! Check your email for confirmation.'})

    except Exception as e:
        logger.error(f"Error processing waitlist signup: {e}")
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500


def send_confirmation_email(name, email):
    try:
        subject = "Welcome to KanairoXO Waitlist! 💌"
        html_body = f"""
        <html>
        <body>
            <h2>Hey {name},</h2>
            <p>Welcome to KanairoXO! You're officially on the waitlist 🎉<br>
            We'll notify you when the app launches 💖</p>
        </body>
        </html>
        """
        msg = Message(subject=subject, recipients=[email], html=html_body)
        mail.send(msg)
        logger.info(f"📧 Confirmation email sent to {email}")
    except Exception as e:
        logger.error(f"❌ Failed to send email to {email}: {str(e)}")


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'KanairoXO API is running'})

# --- Admin-only routes ---
@app.route('/api/waitlist', methods=['GET'])
@admin_required
def get_waitlist():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection failed'}), 500

        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, email, phone, beta_tester, ambassador, created_at
                FROM waitlist_users
                ORDER BY created_at DESC
            """)
            users = cursor.fetchall()
        conn.close()

        return jsonify({'success': True, 'data': users})
    except Exception as e:
        logger.error(f"Error fetching waitlist: {e}")
        return jsonify({'success': False, 'message': 'Failed to fetch waitlist'}), 500

# --- Admin login system ---
@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        password = data.get("password")
        if not password:
            return jsonify({"success": False, "message": "Password required"}), 400

        if password == os.getenv("ADMIN_PASSWORD"):
            session["admin_authenticated"] = True
            session.permanent = True
            # Set isAdmin flag for the client-side
            return jsonify({"success": True, "message": "Login successful", "isAdmin": True})

        return jsonify({"success": False, "message": "Invalid password"}), 401

    except Exception as e:
        logger.error(f"Admin login failed: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500


@app.route('/api/admin-verify', methods=['GET'])
def admin_verify():
    authenticated = session.get("admin_authenticated", False)
    return jsonify({"authenticated": authenticated})


@app.route('/api/admin-logout', methods=['POST'])
def admin_logout():
    session.pop("admin_authenticated", None)
    return jsonify({"success": True, "message": "Logged out"})


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
