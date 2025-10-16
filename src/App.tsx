import { useState } from "react";
import { motion, useAnimation } from "motion/react";
import { Heart, MessageCircle, Sparkles, Users, Instagram, Twitter, ChevronDown } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import logo from "./assets/logo.png";
export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    betaTester: false,
    ambassador: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://kxo.onrender.com/api/join-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // --- STEP 1: Show success UI immediately ---
        setShowSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          betaTester: false,
          ambassador: false,
        });
        setTimeout(() => setShowSuccess(false), 4000);

        // --- STEP 2: Send confirmation email via RESEND ---
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "KanairoXO <noreply@kanairoxo.com>",
            to: formData.email,
            subject: "Welcome to KanairoXO Waitlist! 💌",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <div style="background: linear-gradient(135deg, #D72638, #FF5C8D); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1>Welcome to KanairoXO! 💝</h1>
                </div>
                <div style="padding: 24px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
                  <h2>Hey ${formData.name},</h2>
                  <p>We're thrilled to have you join the KanairoXO waitlist! You're now part of an exclusive group that will be the first to experience where lovers meet — the Kanairo way.</p>
                  <ul>
                    <li>🌟 Early access to features</li>
                    <li>💬 Exclusive updates</li>
                    <li>❤️ Help shape Nairobi's dating scene</li>
                  </ul>
                  <p>With love,<br><strong>The KanairoXO Team</strong> ❤️</p>
                </div>
              </div>
            `,
          }),
        });

        console.log("✅ Email sent successfully");
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting waitlist form:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#D72638] via-[#8B1825] to-[#0D0D0D]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Animated Heart Glow Background with Gradient Pulse */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-full h-full rounded-full blur-[120px]"
              animate={{
                background: [
                  "radial-gradient(circle, #D72638 0%, #FF5C8D 100%)",
                  "radial-gradient(circle, #FF5C8D 0%, #D72638 100%)",
                  "radial-gradient(circle, #D72638 0%, #FF5C8D 100%)",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo with Blur Fade-In */}
          <motion.div
            className="mb-6 relative"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1.1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Glow backdrop behind logo */}
            <motion.div
              className="absolute inset-0 blur-[60px] opacity-60"
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#D72638] via-[#FF5C8D] to-[#D72638] rounded-full" />
            </motion.div>
            
            <motion.img
              src={logo}
              alt="KanairoXO"
              className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 mx-auto object-contain relative z-10"
              style={{
                filter: "drop-shadow(0 0 40px rgba(215, 38, 56, 0.6)) drop-shadow(0 0 80px rgba(255, 92, 141, 0.4)) brightness(1.1) contrast(1.1)",
              }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1 }}
            />
          </motion.div>

          {/* Tagline Slide-Up */}
          <motion.h2
            className="text-2xl md:text-4xl text-white/95 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            Where Lovers Meet – The Kanairo Way.
          </motion.h2>

          {/* Subtext Fade-In */}
          <motion.p
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            A modern dating experience for Nairobi's bold and beautiful.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 1.5, duration: 0.5 },
              y: { duration: 2, repeat: Infinity }
            }}
          >
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </div>
      </section>

      {/* About / Features Section */}
      <section className="relative py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Staggered Word Entrance */}
            <h2 className="text-4xl md:text-5xl text-white mb-6 flex flex-wrap items-center justify-center gap-3">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0 }}
              >
                Swipe.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Connect.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Love.
              </motion.span>
              <motion.span
                className="text-[#FF5C8D]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Feel Seen.
              </motion.span>
            </h2>
            <motion.p
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              KanairoXO is where romance meets Nairobi energy. Whether you're looking for a spark, 
              a laugh, or something deeper — we bring it your way, the Kanairo way.
            </motion.p>
          </div>

          {/* Feature Cards with Pop & Bounce */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: "Swipe",
                description: "Discover people who match your vibe and energy.",
                tooltip: "Find your spark.",
              },
              {
                icon: MessageCircle,
                title: "Chat",
                description: "Start conversations that matter with real connections.",
                tooltip: "Say hi, Kanairo-style.",
              },
              {
                icon: Users,
                title: "Meet",
                description: "Turn digital sparks into real-world moments.",
                tooltip: "Take it offline.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 cursor-pointer transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.4
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF5C8D]/0 to-[#FF5C8D]/0 group-hover:from-[#FF5C8D]/10 group-hover:to-[#D72638]/10 transition-all duration-300" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#D72638] to-[#FF5C8D] rounded-full group-hover:w-3/4 transition-all duration-300 shadow-lg shadow-[#FF5C8D]/50" />
                
                <motion.div 
                  className="bg-gradient-to-br from-[#D72638] to-[#FF5C8D] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-[#FF5C8D]/30 relative z-10"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl text-white mb-3 text-center relative z-10">{feature.title}</h3>
                <p className="text-white/70 text-center leading-relaxed relative z-10">{feature.description}</p>
                
                {/* Tooltip on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white/10 backdrop-blur-md border border-[#FF5C8D]/30 text-white/90 px-4 py-2 rounded-lg text-sm whitespace-nowrap mb-2 shadow-lg">
                    {feature.tooltip}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="relative py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative"
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Success Message */}
            {showSuccess && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#D72638]/95 to-[#FF5C8D]/95 backdrop-blur-md rounded-3xl flex items-center justify-center z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                  >
                    <Heart className="w-20 h-20 text-white mx-auto mb-4" fill="currentColor" />
                  </motion.div>
                  <motion.h3
                    className="text-2xl md:text-3xl text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to the KanairoXO waitlist 💌
                  </motion.h3>
                  <motion.p
                    className="text-white/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    We'll be in touch soon!
                  </motion.p>
                </div>
              </motion.div>
            )}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl text-white mb-3">
                Join the Waitlist 💌
              </h2>
              <p className="text-lg text-white/80">
                Be among the first to experience KanairoXO.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="name" className="block text-white/90 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF5C8D] focus:ring-[#FF5C8D]/30 focus:ring-2 focus:shadow-lg focus:shadow-[#FF5C8D]/20 rounded-xl h-12 transition-all duration-300"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-white/90 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF5C8D] focus:ring-[#FF5C8D]/30 focus:ring-2 focus:shadow-lg focus:shadow-[#FF5C8D]/20 rounded-xl h-12 transition-all duration-300"
                />
              </motion.div>

              {/* Phone Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="phone" className="block text-white/90 mb-2">
                  Phone <span className="text-white/50">(optional)</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 XXX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF5C8D] focus:ring-[#FF5C8D]/30 focus:ring-2 focus:shadow-lg focus:shadow-[#FF5C8D]/20 rounded-xl h-12 transition-all duration-300"
                />
              </motion.div>

              {/* Checkboxes with Pop Animation */}
              <motion.div 
                className="space-y-4 pt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="flex items-start space-x-3"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={formData.betaTester ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Checkbox
                      id="beta"
                      checked={formData.betaTester}
                      onCheckedChange={(checked: boolean | undefined) =>
                        setFormData({ ...formData, betaTester: !!checked })
                      }
                      className="mt-1 border-white/30 data-[state=checked]:bg-[#D72638] data-[state=checked]:border-[#D72638] data-[state=checked]:shadow-lg data-[state=checked]:shadow-[#FF5C8D]/30 transition-all"
                    />
                  </motion.div>
                  <label
                    htmlFor="beta"
                    className="text-white/90 cursor-pointer leading-relaxed"
                  >
                    I want to be a Beta Tester
                  </label>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-3"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={formData.ambassador ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Checkbox
                      id="ambassador"
                      checked={formData.ambassador}
                      onCheckedChange={(checked: boolean | undefined) =>
                        setFormData({ ...formData, ambassador: !!checked })
                      }
                      className="mt-1 border-white/30 data-[state=checked]:bg-[#D72638] data-[state=checked]:border-[#D72638] data-[state=checked]:shadow-lg data-[state=checked]:shadow-[#FF5C8D]/30 transition-all"
                    />
                  </motion.div>
                  <label
                    htmlFor="ambassador"
                    className="text-white/90 cursor-pointer leading-relaxed"
                  >
                    I want to be a Campus Ambassador
                  </label>
                </motion.div>
              </motion.div>

              {/* Submit Button with Heartbeat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="group w-full bg-gradient-to-r from-[#D72638] to-[#FF5C8D] hover:from-[#FF5C8D] hover:to-[#D72638] text-white rounded-xl py-6 shadow-lg shadow-[#FF5C8D]/30 hover:shadow-2xl hover:shadow-[#FF5C8D]/60 transition-all duration-300 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                      </motion.div>
                      Join the Waitlist
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Privacy Note */}
              <p className="text-center text-white/50 text-sm pt-2">
                We respect your privacy. No spam — just love stories.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Social Icons with Rotate & Glow */}
            <div className="flex items-center justify-center space-x-6 mb-8">
                <motion.a
                href="https://www.instagram.com/kanairo_xo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
                whileHover={{ 
                  rotate: 10,
                  backgroundColor: "rgba(255, 92, 141, 0.1)",
                  borderColor: "rgba(255, 92, 141, 0.5)",
                  boxShadow: "0 10px 30px rgba(255, 92, 141, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
                >
                <Instagram className="w-5 h-5 text-white" />
                </motion.a>
              <motion.a
                href="https://www.tiktok.com/@kanairo_xo?_t=ZM-90SVFIJ08JX&_r=1"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
                whileHover={{ 
                  rotate: 10,
                  backgroundColor: "rgba(255, 92, 141, 0.1)",
                  borderColor: "rgba(255, 92, 141, 0.5)",
                  boxShadow: "0 10px 30px rgba(255, 92, 141, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
                whileHover={{ 
                  rotate: 10,
                  backgroundColor: "rgba(255, 92, 141, 0.1)",
                  borderColor: "rgba(255, 92, 141, 0.5)",
                  boxShadow: "0 10px 30px rgba(255, 92, 141, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="X (Twitter)"
              >
                <Twitter className="w-5 h-5 text-white" />
              </motion.a>
            </div>

            {/* Footer Text */}
            <motion.p 
              className="text-white/60 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              © 2025 KanairoXO. All Rights Reserved.
            </motion.p>
            <motion.p 
              className="text-white/80 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Made with 
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-4 h-4 text-[#FF5C8D]" fill="currentColor" />
              </motion.span>
              in Nairobi.
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}