# ✅ Hybrid API Testing Checklist

## 🚀 **Quick Start**

1. **Add API Keys** to `.env`:
   ```env
   VITE_GROQ_API_KEY=gsk_your_groq_key_here
   VITE_OPENAI_API_KEY=sk_your_openai_key_here
   ```

2. **Restart Dev Server**: `npm run dev`

3. **Open Browser Console**: F12 → Console tab

4. **Look for API Key Checker**: Bottom-right corner widget

---

## 📋 **Testing Checklist**

### **✅ API Key Validation**
- [ ] API Key Checker shows both keys as "Valid & Working"
- [ ] Groq test button returns success
- [ ] OpenAI test button returns success
- [ ] Console shows no API key errors

### **✅ Text Operations (Should Use Groq)**

**Universal Input - Text to JSON:**
- [ ] Enter text: "A dragon flying over a mountain"
- [ ] Click Convert
- [ ] Console shows: `🤖 AI Provider: GROQ`
- [ ] Response time under 3 seconds
- [ ] Valid JSON returned

**Character Engine (Pro Feature):**
- [ ] Go to Pro Features → Character Engine  
- [ ] Enter: "Mysterious wizard with ancient staff"
- [ ] Generate Character
- [ ] Console shows: `🤖 AI Provider: GROQ`
- [ ] Character details generated

**Scene Extender:**
- [ ] Create any scene → Scene Extender
- [ ] Click "Continue" option
- [ ] Console shows: `🤖 AI Provider: GROQ`  
- [ ] Extension generated successfully

**AI Optimizer (Pro Feature):**
- [ ] Create scene → AI Optimizer
- [ ] Try any optimization mode
- [ ] Console shows: `🤖 AI Provider: GROQ`
- [ ] Optimized prompt returned

### **✅ Image Operations (Should Use OpenAI)**

**Universal Input - Image to JSON:**
- [ ] Switch to "Image to JSON" mode
- [ ] Upload any image (jpg/png)
- [ ] Click Convert
- [ ] Console shows: `🤖 AI Provider: OPENAI`
- [ ] Console shows: `forceOpenAI: true`
- [ ] Image analysis completed
- [ ] JSON fields extracted

### **✅ Error Handling**

**Missing Groq Key:**
- [ ] Remove `VITE_GROQ_API_KEY` from .env
- [ ] Restart server
- [ ] Try text conversion
- [ ] Error: "Groq API key required"
- [ ] API Key Checker shows Groq as "No API Key"

**Missing OpenAI Key:**
- [ ] Remove `VITE_OPENAI_API_KEY` from .env  
- [ ] Restart server
- [ ] Try image analysis
- [ ] Error: "OpenAI API key required for image analysis"
- [ ] API Key Checker shows OpenAI as "No API Key"

**Invalid Key:**
- [ ] Set `VITE_GROQ_API_KEY=invalid_key`
- [ ] Try text conversion
- [ ] Error message about invalid API key
- [ ] Retry attempts shown in console

### **✅ Performance Verification**

**Groq Speed:**
- [ ] Text operations complete in 1-3 seconds
- [ ] Console shows usage statistics
- [ ] Model shows as `mixtral-8x7b-32768`

**OpenAI Speed:**
- [ ] Image operations complete in 5-15 seconds
- [ ] Console shows usage statistics  
- [ ] Model shows as `gpt-4o`

### **✅ Console Logging**

**Expected Logs for Text Operations:**
```
🤖 AI Provider: GROQ
📝 Request: Convert this scene description...
⚙️ Options: {model: undefined, forceOpenAI: undefined, temperature: 0.3}
GROQ API Request attempt 1/3
✅ GROQ Success: {model: "mixtral-8x7b-32768", usage: {...}, responseLength: 245}
```

**Expected Logs for Image Operations:**
```
🤖 AI Provider: OPENAI  
📝 Request: Analyze this image with extreme...
⚙️ Options: {model: "gpt-4o", forceOpenAI: true, temperature: 0.2}
OPENAI API Request attempt 1/3
✅ OPENAI Success: {model: "gpt-4o", usage: {...}, responseLength: 1250}
```

---

## 🎯 **Success Criteria**

### **✅ All Green:**
- [ ] All text operations use Groq
- [ ] All image operations use OpenAI  
- [ ] API Key Checker shows both as valid
- [ ] No mixed provider usage
- [ ] Fast response times for Groq
- [ ] Proper error messages for missing keys
- [ ] Console logs show correct provider selection

### **⚡ Performance Targets:**
- **Groq Text**: 1-3 seconds
- **OpenAI Images**: 5-15 seconds  
- **No timeout errors**
- **Successful retry logic**

---

## 🚨 **Common Issues & Quick Fixes**

### Issue: "No API Key" despite having keys
**Solution**: Restart dev server after adding keys

### Issue: Console shows no provider logs
**Solution**: Ensure you're in development mode (not production build)

### Issue: All operations use OpenAI
**Solution**: Check for `gpt-` in model names, remove `forceOpenAI` flags

### Issue: Image analysis uses Groq
**Solution**: Check `forceOpenAI: true` is set for image operations

### Issue: Slow Groq responses
**Solution**: Verify console shows "GROQ API Request", check network tab

---

## 🎉 **Ready to Test!**

**Time needed**: ~15 minutes to test all features

**What you'll prove**: 
- ⚡ Groq handles text operations (faster + cheaper)
- 👁️ OpenAI handles image operations (vision capability)  
- 🛡️ Proper error handling and fallbacks
- 📊 Real performance improvements

**Start testing and let me know what you find!** 🚀