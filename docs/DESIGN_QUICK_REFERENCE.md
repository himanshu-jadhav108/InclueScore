# 🎨 Quick Reference - Project Zenith Design System

## 🚀 Quick Start

### Import Components
```javascript
import { motion } from 'framer-motion';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import GradientBackground from '../components/GradientBackground';
import LoadingScreen from '../components/LoadingScreen';
```

---

## 🎨 Common Patterns

### 1. Section Header with Icon Box
```javascript
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
  <Box sx={{
    width: 40, height: 40, borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <YourIcon sx={{ color: 'white', fontSize: 24 }} />
  </Box>
  <Typography variant="h6" color="primary" fontWeight="bold">
    Section Title
  </Typography>
</Box>
```

### 2. Glass Card
```javascript
<Paper elevation={0} sx={{ 
  p: 3, 
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  borderRadius: '16px',
}}>
  {/* Content */}
</Paper>
```

### 3. Animated Card Wrapper
```javascript
<AnimatedCard delay={0.2}>
  {/* Your content */}
</AnimatedCard>
```

### 4. Gradient Button
```javascript
<Button sx={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white', fontWeight: 600, px: 3, py: 1.5,
  borderRadius: '12px', textTransform: 'none',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
  },
}}>
  Click Me
</Button>
```

### 5. Info Box
```javascript
<Box sx={{
  p: 2.5,
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(102, 126, 234, 0.2)',
}}>
  <Typography variant="subtitle2" fontWeight="bold" color="primary">Title</Typography>
  <Typography variant="body2" color="textSecondary">Content</Typography>
</Box>
```

### 6. Gradient Text
```javascript
<Typography sx={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}}>
  Gradient Text
</Typography>
```

### 7. Animated Entrance
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### 8. Staggered List
```javascript
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

---

## 🎯 Color Quick Reference

| Color | Value | Usage |
|-------|-------|-------|
| Primary | `#667eea` | Main brand |
| Secondary | `#764ba2` | Accent |
| Success | `#4caf50` | Positive |
| Warning | `#ff9800` | Caution |
| Error | `#f44336` | Danger |

### Gradient
```css
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

---

## 📏 Spacing Reference

- **Border Radius:** 12px (buttons), 16px (cards)
- **Padding:** 2.5-3 (20-24px)
- **Gap:** 1-2 (8-16px)
- **Icon Size:** 24px (standard), 40px (large)

---

## ✨ Animation Timing

- **Entrance:** 0.3-0.5s
- **Stagger Delay:** 0.1s per item
- **Hover:** 0.2s
- **Background Orbs:** 15-20s

---

## 🔧 Common sx Props

### Card Hover
```javascript
'&:hover': {
  transform: 'translateY(-8px)',
  boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)',
}
```

### Glass Effect
```javascript
background: 'rgba(255, 255, 255, 0.9)',
backdropFilter: 'blur(10px)',
border: '1px solid rgba(102, 126, 234, 0.1)',
```

### Gradient Border
```javascript
border: '1px solid rgba(102, 126, 234, 0.2)',
```

---

## 📱 Responsive

```javascript
<Box sx={{ display: { xs: 'none', sm: 'block' } }}>Desktop Only</Box>
<Box sx={{ display: { xs: 'block', sm: 'none' } }}>Mobile Only</Box>
```

---

## 🎨 Status Colors

### Success Box
```javascript
background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
border: '1px solid rgba(76, 175, 80, 0.3)',
```

### Error Box
```javascript
background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
border: '1px solid rgba(244, 67, 54, 0.3)',
```

### Warning Box
```javascript
background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
border: '1px solid rgba(255, 152, 0, 0.3)',
```

---

## 🚀 Performance Tips

1. Use `transform` instead of `top/left`
2. Limit `backdropFilter` on large areas
3. Use `will-change` sparingly
4. Debounce scroll animations
5. Lazy load heavy components

---

## ✅ Component Checklist

- [ ] Icon box with gradient
- [ ] Glass morphism effect
- [ ] 16px border radius
- [ ] Entrance animation
- [ ] Hover effects
- [ ] Proper spacing (p: 2.5-3)
- [ ] Font weight 600-700 for headings
- [ ] Color contrast checked
- [ ] Responsive design

---

**Version:** 2.0 | **Updated:** Oct 15, 2025
