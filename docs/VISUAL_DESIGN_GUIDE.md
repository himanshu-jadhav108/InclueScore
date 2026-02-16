# Project Zenith - Visual Design Guide

## 🎨 Color System

### Primary Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
**Usage:** Primary buttons, AppBar, icon boxes, important headings

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Royal Blue | `#667eea` | Primary brand color |
| Purple | `#764ba2` | Secondary brand color |
| Success Green | `#4caf50` | Positive states, high scores |
| Warning Orange | `#ff9800` | Medium risk, cautions |
| Error Red | `#f44336` | High risk, errors |
| Light Green | `#8bc34a` | Good scores |

### Secondary Gradients
```css
/* Warm variant */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Success variant */
background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);

/* Cool variant */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

---

## 📐 Spacing & Layout

### Border Radius
- **Cards/Papers:** `16px`
- **Buttons:** `12px`
- **Icon Boxes:** `12px`
- **Small elements:** `8px`

### Padding Scale
- **Large sections:** `p: 3` (24px)
- **Medium sections:** `p: 2.5` (20px)
- **Small sections:** `p: 2` (16px)
- **Compact:** `p: 1.5` (12px)

### Gaps
- **Large grids:** `spacing={3}` (24px)
- **Medium grids:** `spacing={2}` (16px)
- **Small grids:** `spacing={1.5}` (12px)
- **Inline elements:** `gap: 1` (8px)

---

## 🎭 Glass Morphism Effect

### Standard Glass Card
```javascript
<Paper sx={{
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  borderRadius: '16px',
}} />
```

### Stronger Glass Effect
```javascript
<Box sx={{
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}} />
```

---

## ✨ Animation Patterns

### Entrance Animations

#### Fade In
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

#### Scale In (Spring)
```javascript
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ 
    type: "spring",
    stiffness: 260,
    damping: 20 
  }}
>
```

#### Slide In
```javascript
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2 }}
>
```

### Hover Animations

#### Card Hover
```javascript
'&:hover': {
  transform: 'translateY(-8px) scale(1.02)',
  boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)',
}
```

#### Button Hover
```javascript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### Staggered Lists
```javascript
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}
```

---

## 🔤 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Heading Hierarchy
| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| h3 | 3rem | 800 | Page titles |
| h4 | 2.125rem | 700 | Section headers |
| h5 | 1.5rem | 700 | Subsection headers |
| h6 | 1.25rem | 700 | Component titles |

### Body Text
| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| body1 | 1rem | 400 | Main content |
| body2 | 0.875rem | 400 | Secondary content |
| caption | 0.75rem | 400 | Captions, labels |

### Gradient Text Effect
```javascript
<Typography sx={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}}>
```

---

## 🎯 Icon Boxes

### Standard Icon Box
```javascript
<Box sx={{
  width: 40,
  height: 40,
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
}}>
  <Icon sx={{ color: 'white', fontSize: 24 }} />
</Box>
```

### Large Icon Box (80x80)
Used for login/signup pages:
```javascript
<Box sx={{
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
}}>
  <Icon sx={{ color: 'white', fontSize: 40 }} />
</Box>
```

---

## 🃏 Card Components

### AnimatedCard Usage
```javascript
<AnimatedCard delay={0.2} hover>
  <CardContent>
    {/* Your content */}
  </CardContent>
</AnimatedCard>
```

### Info Box Pattern
```javascript
<Box sx={{
  p: 2.5,
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(102, 126, 234, 0.2)',
}}>
  <Typography variant="subtitle2" fontWeight="bold" color="primary">
    Title
  </Typography>
  <Typography variant="body2" color="textSecondary">
    Content
  </Typography>
</Box>
```

---

## 🔘 Button Styles

### Primary Gradient Button
```javascript
<Button sx={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 600,
  px: 3,
  py: 1.5,
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
  },
}} />
```

### Outlined Button
```javascript
<Button sx={{
  borderColor: 'rgba(102, 126, 234, 0.5)',
  color: 'primary.main',
  fontWeight: 600,
  px: 3,
  py: 1.5,
  borderRadius: '12px',
  textTransform: 'none',
  '&:hover': {
    borderColor: 'primary.main',
    background: 'rgba(102, 126, 234, 0.05)',
  },
}} />
```

---

## 📊 Data Visualization

### Score Chip
```javascript
<Chip
  label="Excellent"
  sx={{
    bgcolor: '#4caf5020',
    color: '#4caf50',
    fontWeight: 700,
    fontSize: '1rem',
    height: 36,
    border: '2px solid #4caf5040',
  }}
/>
```

### Status Box (Success)
```javascript
<Box sx={{
  p: 2.5,
  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(76, 175, 80, 0.3)',
  textAlign: 'center',
}}>
  <Typography variant="h5" fontWeight="bold" color="success.main">
    +25
  </Typography>
  <Typography variant="caption" color="textSecondary" fontWeight={600}>
    Score Change
  </Typography>
</Box>
```

### Status Box (Error)
```javascript
<Box sx={{
  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
  border: '1px solid rgba(244, 67, 54, 0.3)',
}} />
```

---

## 🌊 Floating Orbs

### Background Orb
```javascript
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    x: [0, 50, 0],
    y: [0, 30, 0],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  style={{
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
    filter: 'blur(40px)',
  }}
/>
```

---

## 📱 Responsive Breakpoints

### Grid Breakpoints
```javascript
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Content adapts to screen size */}
  </Grid>
</Grid>
```

### Hide on Mobile
```javascript
<Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
  Desktop Only
</Typography>
```

---

## ⚡ Performance Tips

1. **Use transform over position:** GPU-accelerated
2. **Limit backdrop-filter usage:** Can be expensive
3. **Debounce animations:** Especially on scroll
4. **Use will-change sparingly:** Only for animated properties
5. **Optimize gradients:** Use conic-gradient for complex effects

---

## 🎨 Color Usage Guidelines

### When to Use Each Color

**Primary Gradient (#667eea → #764ba2)**
- Primary actions
- Important headings
- Navigation bars
- Icon containers
- Key metrics

**Success Green (#4caf50)**
- High credit scores (750+)
- Positive changes
- Successful actions
- Low risk indicators

**Warning Orange (#ff9800)**
- Medium risk (450-650)
- Caution states
- Important notices

**Error Red (#f44336)**
- High risk
- Errors
- Failed actions
- Critical alerts

---

## 🔍 Accessibility Considerations

### Contrast Ratios
- Text on gradient backgrounds: Use white or very dark text
- Ensure 4.5:1 minimum for body text
- Ensure 3:1 minimum for large text

### Focus States
```javascript
'&:focus-visible': {
  outline: '2px solid #667eea',
  outlineOffset: '2px',
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📝 Component Checklist

When creating new components, ensure:
- ✅ Gradient icon box for section headers
- ✅ Glass morphism effect on cards
- ✅ 16px border radius
- ✅ Entrance animation with motion.div
- ✅ Hover effects on interactive elements
- ✅ Consistent spacing (p: 2.5-3)
- ✅ Gradient backgrounds for important info boxes
- ✅ Font weight 600-700 for headings
- ✅ Proper color contrast
- ✅ Responsive design

---

**Design System Version:** 2.0  
**Last Updated:** October 15, 2025  
**Maintained by:** Project Zenith Team
