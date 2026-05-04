# 🚀 MLM System - Multi-Level Marketing Platform

A modern, feature-rich Multi-Level Marketing (MLM) system built with React.js. This platform provides a complete solution for managing referrals, tracking downlines, and handling commissions.

## ✨ Features

### 🔐 Authentication
- User Registration with referral code support
- Secure Login system
- User profile management

### 📊 Dashboard
- Real-time statistics overview
- Total referrals count
- Active downline tracking
- Earnings summary
- Quick action cards

### 🔗 Referral System
- Unique referral code generation
- Shareable referral links
- Social media sharing (WhatsApp, Facebook, Twitter, Email)
- Referral statistics tracking

### 👥 Downline Management
- Visual network tree representation
- Expandable/collapsible node structure
- Multi-level downline tracking
- Network statistics

### 💰 Commission Tracking
- Commission history
- Earnings breakdown (Total, Monthly, Pending, Paid)
- Commission structure display
- Multiple commission types (Direct, Level 1, Level 2, Bonus)

### 👤 Profile Management
- Edit personal information
- Bank details management
- Account statistics
- Referral code display

## 🛠️ Technology Stack

- **React 18.2.0** - UI Library
- **React Router DOM 6.20.0** - Routing
- **React Scripts 5.0.1** - Build tools
- **CSS3** - Styling with modern gradients and animations

## 📦 Installation

1. **Navigate to project directory**
   ```bash
   cd D:\ReactProjects\mlm-react-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`

## 🎨 Design Features

- **Modern UI/UX** - Beautiful gradient backgrounds and smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Hover effects and transitions
- **Card-based Layout** - Clean and organized interface

## 📱 Pages

1. **Login** (`/login`) - User authentication
2. **Register** (`/register`) - New user registration with referral code
3. **Dashboard** (`/dashboard`) - Main overview page
4. **Referrals** (`/referrals`) - Referral code and sharing
5. **Downline** (`/downline`) - Network tree visualization
6. **Commissions** (`/commissions`) - Earnings and commission history
7. **Profile** (`/profile`) - User profile management

## 🔧 Configuration

The application uses **localStorage** for data persistence. All user data, referrals, and commissions are stored locally in the browser.

### Data Structure
- Users are stored in `mlm_users` key
- Current user session in `mlm_user` key
- Commissions in `commissions_{userId}` key

## 🚀 Usage

1. **Register a new account**
   - Go to `/register`
   - Fill in your details
   - Optionally enter a referral code if you have one

2. **Login**
   - Use your email and password to login

3. **Get your referral code**
   - Navigate to Referrals page
   - Copy your unique referral code or link
   - Share with others

4. **Track your network**
   - View your downline tree
   - See all referrals and their networks

5. **Monitor earnings**
   - Check commission history
   - View total and monthly earnings

## 📊 Commission Structure

- **Direct Referral**: 10% commission
- **Level 1**: 5% commission from referrals' network
- **Level 2**: 3% commission from second level
- **Bonus**: Special milestone bonuses

## 🎯 Key Features

- ✅ Multi-level referral tracking
- ✅ Real-time statistics
- ✅ Social media sharing
- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ Local data persistence
- ✅ Commission calculation
- ✅ Network visualization
- ✅ Smooth animations and transitions

## 📝 Notes

- This is a frontend-only application
- Data is stored in browser localStorage
- For production use, integrate with a backend API
- Add proper authentication and security measures

## 🔒 Security Recommendations

For production deployment:
- Implement proper backend authentication
- Use secure session management
- Add API rate limiting
- Implement proper data encryption
- Add input validation and sanitization

## 📄 License

This project is open source and available for use.

## 👨‍💻 Development

### Project Structure
```
mlm-react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Referrals/
│   │   ├── Downline/
│   │   ├── Commissions/
│   │   ├── Profile/
│   │   └── Layout/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎉 Enjoy!

Start building your MLM network today! 🚀
