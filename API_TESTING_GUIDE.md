# 🧪 Hybrid API Testing Guide

## 🔑 **Step 1: Set Up Your API Keys**

### Get Your API Keys:
1. **Groq API Key**:
   - Visit: https://console.groq.com
   - Sign up/login → Create API key
   - Copy key (starts with `gsk_`)

2. **OpenAI API Key**:
   - Visit: https://platform.openai.com/api-keys
   - Sign up/login → Create new secret key
   - Copy key (starts with `sk-`)

### Add to Environment:
Create/edit `.env` file in project root:
```env
VITE_GROQ_API_KEY=gsk_your_groq_key_here
VITE_OPENAI_API_KEY=sk_your_openai_key_here
```

**Important**: Restart your dev server after adding keys!

---

## 🚀 **Step 2: Test Each Feature**

### **Text Operations (Should Use Groq)**
✅ **Text-to-JSON Conversion**:
1. Open app → Universal Input
2. Enter: "A wizard casting spells in a dark forest"
3. Click Convert
4. **Look for**: Console log showing "GROQ API Request"
5. **Expect**: Fast response (under 2 seconds)

✅ **Character Generation**:
1. Go to Pro Features → Character Engine
2. Enter: "Brave knight with magical sword"
3. Generate character
4. **Look for**: Console log showing "GROQ API Request"

✅ **Scene Extension**:
1. Create any scene → Scene Extender
2. Try "Continue" option
3. **Look for**: Console log showing "GROQ API Request"

### **Image Operations (Should Use OpenAI)**
✅ **Image-to-JSON Analysis**:
1. Universal Input → Switch to "Image to JSON"
2. Upload any image
3. Click Convert
4. **Look for**: Console log showing "OPENAI API Request"
5. **Look for**: "forceOpenAI: true" in request

---

## 🔍 **Step 3: Check Browser Console**

### Open Developer Tools:
- **Chrome/Edge**: F12 or Ctrl+Shift+I
- **Firefox**: F12 or Ctrl+Shift+K
- **Safari**: Cmd+Option+I

### What to Look For:
```
✅ GROQ API Request attempt 1/3
✅ OPENAI API Request attempt 1/3  
✅ Response with usage data
❌ API key errors
❌ Network failures
```

---

## ⚠️ **Step 4: Test Error Handling**

### Test Missing Keys:
1. Remove `VITE_GROQ_API_KEY` from .env
2. Try text conversion
3. **Expect**: "Groq API key required" error

4. Remove `VITE_OPENAI_API_KEY` from .env  
5. Try image analysis
6. **Expect**: "OpenAI API key required for image analysis" error

### Test Invalid Keys:
1. Set `VITE_GROQ_API_KEY=invalid_key`
2. Try text conversion
3. **Expect**: "Invalid API key" error with retry attempts

---

## 📊 **Step 5: Performance Check**

### Speed Test:
- **Groq operations**: Should be very fast (1-3 seconds)
- **OpenAI operations**: Slightly slower (3-8 seconds)
- **Image analysis**: Slower due to vision processing (5-15 seconds)

### Usage Monitoring:
Check console for usage data:
```javascript
{
  usage: {
    prompt_tokens: 45,
    completion_tokens: 123,
    total_tokens: 168
  }
}
```

---

## 🎯 **Success Criteria**

✅ Text operations use Groq (faster, cheaper)
✅ Image operations use OpenAI (vision capability)
✅ Proper error messages for missing keys
✅ Console logs show correct provider
✅ No mixed provider usage
✅ Reasonable response times

---

## 🚨 **Common Issues & Solutions**

### "API key required" despite having keys:
- Restart dev server after adding keys
- Check .env file is in project root
- Ensure keys start with correct prefix (gsk_/sk_)

### Console shows no logs:
- Check if dev mode: should see provider logs
- Open Network tab to see actual API calls

### Slow Groq responses:
- Check you're using Groq key, not OpenAI for text
- Verify console shows "GROQ API Request"

### Image analysis fails:
- Ensure OpenAI key has vision model access
- Check image size (max 20MB)
- Verify model is gpt-4o (has vision)

---

## 🎉 **Ready to Test!**

1. Set up your `.env` file
2. Restart dev server: `npm run dev`
3. Follow the testing checklist above
4. Report any issues you find!

**Your app should now be using the best of both worlds**: ⚡ Groq for speed + 👁️ OpenAI for vision!