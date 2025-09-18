# 79Pay Content Management System

This document explains how to use the JSON-based content management system for the 79Pay website.

## Overview

All website text content has been moved from hardcoded HTML/JavaScript to a structured JSON file system. This allows for:

- **Easy content updates** without touching code
- **Multi-language support** for localization
- **Backend integration** for dynamic content loading
- **Content versioning** and management
- **Separation of content from presentation**

## File Structure

```
79pay-website/
├── content.json           # Default English content
├── content-ar.json        # Arabic translation example
├── content-manager.js     # Content management class
├── script.js             # Updated main script
└── index.html            # HTML template
```

## Content Structure

The JSON files are organized by website sections:

```json
{
  "navigation": { ... },
  "hero": { ... },
  "features": { ... },
  "about": { ... },
  "partners": { ... },
  "cta": { ... },
  "contact": { ... },
  "footer": { ... },
  "meta": { ... }
}
```

## Usage

### Basic Usage

The content is automatically loaded when the page loads:

```javascript
// Content is loaded automatically
// No additional code needed
```

### Manual Content Loading

```javascript
const contentManager = new ContentManager();

// Load default content
await contentManager.loadContent();

// Load specific language
await contentManager.loadContent('./content-ar.json');

// Populate all sections
contentManager.populateAll();
```

### Getting Specific Content

```javascript
// Get navigation data
const nav = contentManager.getContent('navigation');

// Get hero title
const title = contentManager.getContent('hero.title.main');

// Get service data
const services = contentManager.getContent('hero.services');
```

### Language Switching

```javascript
async function switchLanguage(language) {
  const contentManager = new ContentManager();
  
  // Load language-specific content
  await contentManager.loadContent(`./content-${language}.json`);
  
  // Update all page content
  contentManager.populateAll();
  
  // Update interactive features
  initializeInteractiveFeatures(contentManager);
}

// Switch to Arabic
switchLanguage('ar');
```

## Content Sections

### Navigation
```json
{
  "navigation": {
    "logo": "79Pay",
    "menuItems": [
      { "href": "#home", "text": "Home" }
    ],
    "ctaButton": "Get Started"
  }
}
```

### Hero Section
```json
{
  "hero": {
    "title": {
      "highlight": "Coming Soon",
      "main": "The Next Generation of Digital Payments"
    },
    "subtitle": "Description text...",
    "buttons": {
      "primary": { "icon": "fas fa-envelope", "text": "Get Early Access" }
    },
    "card": {
      "logo": "79Pay",
      "number": "**** **** **** 7979",
      "name": "John Doe",
      "expiry": "12/28"
    },
    "services": {
      "security": {
        "icon": "fas fa-shield-alt",
        "title": "Bank-Grade Security",
        "description": "PCI DSS certified...",
        "tooltip": "Bank-Grade Security"
      }
    }
  }
}
```

### Features Section
```json
{
  "features": {
    "header": {
      "title": "What's Coming",
      "subtitle": "Revolutionary fintech solutions..."
    },
    "items": [
      {
        "icon": "fas fa-credit-card",
        "title": "Next-Gen Payment Cards",
        "description": "Advanced payment card solutions..."
      }
    ]
  }
}
```

## Backend Integration

### API Endpoint Setup

Create an API endpoint to serve content:

```javascript
// Example Express.js endpoint
app.get('/api/content/:language?', (req, res) => {
  const language = req.params.language || 'en';
  const content = loadContentFile(`content-${language}.json`);
  res.json(content);
});
```

### Dynamic Loading

```javascript
// Load from API instead of static file
const contentManager = new ContentManager();
await contentManager.loadContent('/api/content/en');
```

### Content Updates

```javascript
// Update content via API
async function updateContent(section, data) {
  await fetch('/api/content/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, data })
  });
  
  // Reload content
  await contentManager.loadContent();
  contentManager.populateAll();
}
```

## Localization

### Adding New Languages

1. Create a new JSON file: `content-[language-code].json`
2. Copy the structure from `content.json`
3. Translate all text values
4. Keep icons, hrefs, and structure unchanged

Example for French:
```bash
cp content.json content-fr.json
# Edit content-fr.json with French translations
```

### RTL Language Support

For RTL languages like Arabic, add CSS direction support:

```css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .hero-content {
  grid-template-columns: 1fr 1fr;
}
```

Load RTL content:
```javascript
// Set document direction
document.dir = 'rtl';

// Load Arabic content
await contentManager.loadContent('./content-ar.json');
contentManager.populateAll();
```

## Content Validation

### Schema Validation

Create a JSON schema to validate content structure:

```javascript
const contentSchema = {
  type: "object",
  required: ["navigation", "hero", "features"],
  properties: {
    navigation: {
      type: "object",
      required: ["logo", "menuItems"],
      properties: {
        logo: { type: "string" },
        menuItems: {
          type: "array",
          items: {
            type: "object",
            required: ["href", "text"],
            properties: {
              href: { type: "string" },
              text: { type: "string" }
            }
          }
        }
      }
    }
  }
};
```

### Validation Function

```javascript
function validateContent(content, schema) {
  // Use a JSON schema validator library
  const valid = validator.validate(content, schema);
  if (!valid) {
    console.error('Content validation failed:', validator.errors);
    return false;
  }
  return true;
}
```

## Error Handling

The system includes built-in fallbacks:

```javascript
try {
  await contentManager.loadContent();
  contentManager.populateAll();
} catch (error) {
  console.error('Failed to load content:', error);
  // Falls back to existing hardcoded content
  initializeInteractiveFeatures();
}
```

## Best Practices

### Content Organization
- Keep related content grouped together
- Use consistent naming conventions
- Include all necessary metadata (icons, links, etc.)

### Performance
- Minimize JSON file sizes
- Use CDN for content files
- Implement caching strategies
- Load only necessary language content

### Maintenance
- Use version control for content files
- Validate content before deployment
- Test all language versions
- Keep content structure consistent across languages

### Security
- Validate content on load
- Sanitize user-generated content
- Use HTTPS for content delivery
- Implement proper access controls

## Troubleshooting

### Common Issues

1. **Content not loading:**
   - Check file paths
   - Verify JSON syntax
   - Check network requests in browser dev tools

2. **Missing content:**
   - Verify JSON structure matches expected format
   - Check console for warning messages
   - Ensure all required fields are present

3. **Language switching not working:**
   - Verify language file exists
   - Check file naming convention
   - Ensure content structure is consistent

### Debug Mode

Enable debug logging:

```javascript
const contentManager = new ContentManager();
contentManager.debug = true; // Enable debug logging
```

This comprehensive system makes content management flexible, scalable, and ready for backend integration or localization needs. 