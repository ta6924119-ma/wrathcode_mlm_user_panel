import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt, 
  FaWallet, 
  FaTrophy,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft,
  FaGift,
  FaCoins,
  FaNetworkWired,
  FaHandshake,
  FaUserPlus,
  FaShareAlt,
  FaDollarSign,
  FaCrown,
  FaGem,
  FaCheck,
  FaArrowDown
} from 'react-icons/fa';
import Footer from '../Layout/Footer';
import LandingHeader from './LandingHeader';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const heroSectionRef = useRef(null);


  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D card tilt effect
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card-3d, .testimonial-card-3d');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .slide-up-3d');
      elements.forEach(el => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const features = [
    {
      icon: <FaUsers />,
      title: 'Multi-Level Network',
      description: 'Build and manage your downline network with unlimited levels and real-time tracking.',
      color: '#6366f1'
    },
    {
      icon: <FaChartLine />,
      title: 'Real-Time Analytics',
      description: 'Track your earnings, commissions, and network growth with detailed analytics dashboard.',
      color: '#10b981'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Platform',
      description: 'Bank-level security with encrypted transactions and secure wallet management.',
      color: '#f59e0b'
    },
    {
      icon: <FaWallet />,
      title: 'Instant Payouts',
      description: 'Get your commissions and earnings instantly with multiple payment options.',
      color: '#ec4899'
    },
    {
      icon: <FaTrophy />,
      title: 'Rewards & Bonuses',
      description: 'Earn bonuses, rewards, and special incentives as you grow your network.',
      color: '#8b5cf6'
    },
    {
      icon: <FaNetworkWired />,
      title: 'Global Network',
      description: 'Connect with members worldwide and expand your business internationally.',
      color: '#06b6d4'
    }
  ];

  const benefits = [
    { icon: <FaCoins />, text: 'Passive Income Generation' },
    { icon: <FaGift />, text: 'Referral Bonuses' },
    { icon: <FaHandshake />, text: 'Team Building Support' },
    { icon: <FaChartLine />, text: 'Performance Tracking' }
  ];


  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Top Performer',
      text: 'This platform has completely transformed my income. The multi-level system is easy to understand and the payouts are instant.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Network Builder',
      text: 'Best MLM platform I\'ve ever used. The analytics are detailed and the support team is always helpful.',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Business Owner',
      text: 'The referral system is amazing. I\'ve built a strong network and my earnings keep growing every month.',
      rating: 5
    }
  ];

  return (
    <div className="landing-page" ref={heroSectionRef}>
      <LandingHeader />
      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            size: `${2 + Math.random() * 4}px`
          }}></div>
        ))}
      </div>

      {/* Flashy Glow Effects */}
      <div className="flashy-glow-container">
        <div className="flashy-glow glow-1"></div>
        <div className="flashy-glow glow-2"></div>
        <div className="flashy-glow glow-3"></div>
        <div className="flashy-glow glow-4"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="animated-grid-bg"></div>

      {/* Hero Section */}
      <section className="hero-section-new">
        <div className="hero-bg-grid"></div>
        <div className="hero-abstract-waves"></div>
        
        <div className="hero-container-new">
          {/* Left Content */}
          <div className="hero-left-content">
            <h1 className="hero-title-new">
              Build and grow your network <span className="highlight-gold">empire</span> like never before.
            </h1>
            <p className="hero-desc-new">
              Join thousands of successful entrepreneurs building passive income through our advanced multi-level marketing platform. 
              Track, grow, and earn with cutting-edge tools designed for your success.
            </p>
            
            <div className="hero-features-list">
              <div className="hero-feature-item">
                <FaCheckCircle className="feature-check" />
                <span>Unlimited referral levels</span>
              </div>
              <div className="hero-feature-item">
                <FaCheckCircle className="feature-check" />
                <span>Instant commission payouts</span>
              </div>
              <div className="hero-feature-item">
                <FaCheckCircle className="feature-check" />
                <span>Real-time analytics dashboard</span>
              </div>
            </div>

            <div className="hero-cta-new">
              <button 
                className="btn-primary-gold"
                onClick={() => navigate('/register')}
              >
                Get Started Free
                <FaArrowRight className="btn-icon" />
              </button>
              <button 
                className="btn-secondary-outline"
                onClick={() => navigate('/login')}
              >
                View Dashboard
              </button>
            </div>
          </div>

          {/* Right Content - 3D Illustration */}
          <div className="hero-right-content">
            {/* Enhanced 3D Background Elements */}
            <div className="hero-3d-bg-elements">
              <div className="bg-circle circle-1"></div>
              <div className="bg-circle circle-2"></div>
              <div className="bg-circle circle-3"></div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="phone-mockup">
              <div className="phone-glow"></div>
              <div className="phone-screen">
                <div className="phone-header">
                  <span className="phone-time">9:41</span>
                  <div className="phone-icons">
                    <span className="phone-icon"></span>
                    <span className="phone-icon"></span>
                    <span className="phone-icon"></span>
                  </div>
                </div>
                <div className="phone-content">
                  <div className="phone-balance">
                    <div className="balance-label">Total Earnings</div>
                    <div className="balance-amount">$48,296.24</div>
                    <div className="balance-change">+$7,296 (↑4.65%) this month</div>
                  </div>
                  <div className="phone-actions">
                    <button className="phone-btn-primary">Invest Now</button>
                    <button className="phone-btn-secondary">Withdraw</button>
                  </div>
                  <div className="phone-stats">
                    <div className="phone-stat-item">
                      <div className="stat-label-small">Referrals</div>
                      <div className="stat-value-small">24</div>
                    </div>
                    <div className="phone-stat-item">
                      <div className="stat-label-small">Downline</div>
                      <div className="stat-value-small">18</div>
                    </div>
                    <div className="phone-stat-item">
                      <div className="stat-label-small">Commissions</div>
                      <div className="stat-value-small">$2,450</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="floating-card card-1">
              <div className="card-header-small">
                <FaChartLine className="card-icon-small" />
                <span>Network Growth</span>
              </div>
              <div className="card-chart">
                <div className="chart-bars">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i} 
                      className="chart-bar"
                      style={{
                        height: `${30 + Math.random() * 60}%`,
                        background: Math.random() > 0.5 ? '#10b981' : '#ef4444'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="card-value">↑12.34%</div>
            </div>

            <div className="floating-card card-2">
              <div className="card-header-small">
                <FaUsers className="card-icon-small" />
                <span>Active Members</span>
              </div>
              <div className="card-number-large">50K+</div>
              <div className="card-change">+2,450 this week</div>
            </div>

            {/* Floating Coins */}
            <div className="floating-coin coin-1">
              <div className="coin-icon">$</div>
              <div className="coin-label">Earnings</div>
            </div>

            <div className="floating-coin coin-2">
              <div className="coin-icon">%</div>
              <div className="coin-label">ROI</div>
            </div>

            {/* Abstract 3D Shapes */}
            <div className="abstract-shape shape-1"></div>
            <div className="abstract-shape shape-2"></div>
            <div className="abstract-shape shape-3"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <h2 className="section-title">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="section-description">
              Everything you need to build and manage a successful MLM business
            </p>
          </div>
          <div className="features-image-wrapper">
            <div className="features-illustration">
              <div className="illustration-circle circle-feature-1"></div>
              <div className="illustration-circle circle-feature-2"></div>
              <div className="illustration-circle circle-feature-3"></div>
              <FaNetworkWired className="illustration-icon" />
            </div>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card feature-card-3d fade-in-up slide-up-3d ${index % 2 === 0 ? 'fade-in-left' : 'fade-in-right'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-3d-wrapper">
                  <div className="card-glow-effect" style={{ background: `radial-gradient(circle, ${feature.color}40 0%, transparent 70%)` }}></div>
                  <div className="feature-icon icon-3d" style={{ color: feature.color }}>
                    <div className="icon-glow" style={{ boxShadow: `0 0 40px ${feature.color}60` }}></div>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-hover-effect"></div>
                  <div className="card-shine"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text fade-in-left">
              <h2 className="section-title">
                Why Choose <span className="gradient-text">Our Platform</span>
              </h2>
              <p className="section-description">
                Experience the most advanced MLM platform with features designed to maximize your earning potential
              </p>
              <div className="benefits-image-mobile">
                <div className="benefits-illustration">
                  <FaTrophy className="illustration-icon-large" />
                  <div className="illustration-glow"></div>
                </div>
              </div>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="benefit-icon">{benefit.icon}</div>
                    <span className="benefit-text">{benefit.text}</span>
                    <FaCheckCircle className="check-icon" />
                  </div>
                ))}
              </div>
            </div>
            <div className="benefits-visual fade-in-right">
              <div className="benefits-illustration-desktop">
                <div className="stats-illustration">
                  <div className="illustration-card card-illustration-1">
                    <FaChartLine className="card-icon-illustration" />
                    <div className="card-number-illustration">$2,450</div>
                  </div>
                  <div className="illustration-card card-illustration-2">
                    <FaUsers className="card-icon-illustration" />
                    <div className="card-number-illustration">24</div>
                  </div>
                  <div className="illustration-card card-illustration-3">
                    <FaNetworkWired className="card-icon-illustration" />
                    <div className="card-number-illustration">18</div>
                  </div>
                </div>
                <div className="illustration-connections">
                  <div className="connection-line line-1"></div>
                  <div className="connection-line line-2"></div>
                  <div className="connection-line line-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-description">
              Get started in just 3 simple steps and start earning today
            </p>
          </div>
          <div className="how-it-works-image">
            <div className="process-illustration">
              <div className="process-flow">
                <div className="flow-arrow arrow-1"></div>
                <div className="flow-arrow arrow-2"></div>
              </div>
              <div className="process-icons-wrapper">
                <div className="process-icon-circle">
                  <FaUserPlus className="process-icon" />
                </div>
                <div className="process-icon-circle">
                  <FaShareAlt className="process-icon" />
                </div>
                <div className="process-icon-circle">
                  <FaDollarSign className="process-icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="steps-container">
            <div className="steps-line"></div>
            {[
              {
                step: 1,
                icon: <FaUserPlus />,
                title: 'Create Account',
                description: 'Sign up for free and get your unique referral code instantly. No credit card required.',
                color: '#6366f1'
              },
              {
                step: 2,
                icon: <FaShareAlt />,
                title: 'Share & Refer',
                description: 'Share your referral link with friends and family. Build your network and grow your downline.',
                color: '#10b981'
              },
              {
                step: 3,
                icon: <FaDollarSign />,
                title: 'Earn Commissions',
                description: 'Start earning commissions from your referrals and their network. Get paid instantly.',
                color: '#f59e0b'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="step-card fade-in-up slide-up-3d"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="step-number">{step.step}</div>
                <div className="step-icon-wrapper" style={{ background: `${step.color}20`, borderColor: step.color }}>
                  <div className="step-icon" style={{ color: step.color }}>
                    {step.icon}
                  </div>
                  <div className="step-icon-glow" style={{ boxShadow: `0 0 30px ${step.color}60` }}></div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <div className="step-arrow">
                  <FaArrowDown />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="plans" className="plans-section-landing">
        <div className="container">
          <div className="section-header fade-in-up">
            <h2 className="section-title">
              Choose Your <span className="gradient-text">Investment Plan</span>
            </h2>
            <p className="section-description">
              Select the perfect plan that matches your investment goals and start earning returns
            </p>
          </div>
          <div className="plans-illustration-wrapper">
            <div className="plans-illustration">
              <FaWallet className="illustration-icon-large" />
              <div className="money-particles">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="money-particle" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}>$</div>
                ))}
              </div>
            </div>
          </div>
          <div className="plans-grid-landing">
            {[
              {
                name: 'Basic',
                icon: <FaTrophy />,
                min: '$50',
                max: '$1,000',
                roi: '150%',
                duration: '30 days',
                color: '#6366f1',
                features: ['Daily Returns', 'Instant Payouts', '24/7 Support']
              },
              {
                name: 'Silver',
                icon: <FaGem />,
                min: '$200',
                max: '$2,000',
                roi: '175%',
                duration: '35 days',
                color: '#8b5cf6',
                features: ['Higher Returns', 'Priority Support', 'Bonus Rewards']
              },
              {
                name: 'Gold',
                icon: <FaCrown />,
                min: '$1,000',
                max: '$5,000',
                roi: '200%',
                duration: '40 days',
                color: '#f59e0b',
                features: ['Premium Returns', 'VIP Support', 'Exclusive Bonuses'],
                popular: true
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`plan-card-landing fade-in-up slide-up-3d ${plan.popular ? 'popular-plan' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-card-3d-wrapper">
                  <div className="plan-icon-landing" style={{ color: plan.color }}>
                    {plan.icon}
                  </div>
                  <h3 className="plan-name-landing">{plan.name}</h3>
                  <div className="plan-pricing">
                    <div className="plan-min-max">
                      <span className="plan-label">Investment Range:</span>
                      <span className="plan-value">{plan.min} - {plan.max}</span>
                    </div>
                    <div className="plan-roi">
                      <span className="roi-label">Max ROI</span>
                      <span className="roi-value" style={{ color: plan.color }}>{plan.roi}</span>
                    </div>
                    <div className="plan-duration">
                      <span className="duration-label">Duration:</span>
                      <span className="duration-value">{plan.duration}</span>
                    </div>
                  </div>
                  <div className="plan-features">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="plan-feature-item">
                        <FaCheck className="feature-check" style={{ color: plan.color }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="plan-cta-btn"
                    style={{ background: plan.color }}
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                    <FaArrowRight className="btn-icon" />
                  </button>
                  <div className="plan-card-shine"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <h2 className="section-title">
              What Our <span className="gradient-text">Members Say</span>
            </h2>
            <p className="section-description">
              Join thousands of satisfied members building their financial future
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card testimonial-card-3d fade-in-up slide-up-3d"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="testimonial-3d-wrapper">
                  <div className="testimonial-header">
                    <div className="quote-icon quote-3d">
                      <FaQuoteLeft />
                    </div>
                    <div className="rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="star-icon star-3d" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar avatar-3d">
                      <div className="avatar-glow"></div>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="testimonial-shine"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-gradient"></div>
        </div>
        <div className="container">
          <div className="cta-content fade-in-up">
            <h2 className="cta-title">
              Ready to Start <span className="gradient-text">Earning?</span>
            </h2>
            <p className="cta-description">
              Join our platform today and start building your network empire. 
              No credit card required. Free to get started.
            </p>
            <div className="cta-buttons">
              <button 
                className="btn-primary btn-large"
                onClick={() => navigate('/register')}
              >
                Create Free Account
                <FaArrowRight className="btn-icon" />
              </button>
              <button 
                className="btn-secondary btn-large"
                onClick={() => navigate('/login')}
              >
                Sign In to Existing Account
              </button>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <FaCheckCircle />
                <span>No Setup Fees</span>
              </div>
              <div className="cta-feature">
                <FaCheckCircle />
                <span>Instant Access</span>
              </div>
              <div className="cta-feature">
                <FaCheckCircle />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
