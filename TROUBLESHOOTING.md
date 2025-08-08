# 🔧 Hybrid API Troubleshooting Guide

## 🚨 **Common Issues & Solutions**

### **1. "API Key Required" Errors**

#### **Problem**: Getting "Groq API key required" despite having key
```
❌ Error: Groq API key required. Please set your Groq API key in settings.
```

**Solutions**:
1. **Check .env file location**: Must be in project root (same folder as package.json)
2. **Check key format**: Must start with `gsk_`
3. **Restart dev server**: Always restart after adding keys
4. **Check spelling**: `VITE_GROQ_API_KEY` (exact spelling)

#### **Problem**: Getting "OpenAI API key required" for image analysis
```
❌ Error: OpenAI API key required for image analysis. Please set your OpenAI API key in settings.
```

**Solutions**:
1. **Check key format**: Must start with `sk-`
2. **Check permissions**: Key must have vision model access
3. **Verify in .env**: `VITE_OPENAI_API_KEY=sk-your-key`

---

### **2. Wrong Provider Being Used**

#### **Problem**: Text operations using OpenAI instead of Groq
```
🤖 AI Provider: OPENAI  (Should be GROQ)
```

**Debug Steps**:
1. Check console for `forceOpenAI: true` - should be undefined for text
2. Check model name - should NOT contain 'gpt-'
3. Look for explicit model override in component

**Common Causes**:
- Component explicitly setting `model: 'gpt-4o-mini'`
- `forceOpenAI: true` flag set incorrectly
- Legacy code using old API patterns

#### **Problem**: Image operations using Groq instead of OpenAI  
```
🤖 AI Provider: GROQ  (Should be OPENAI)
```

**Debug Steps**:
1. Check `forceOpenAI: true` is set for image operations
2. Verify image analysis method has correct options
3. Check console for model name - should be 'gpt-4o'

---

### **3. No Console Logs Appearing**

#### **Problem**: Not seeing provider logs in console
```
Expected: 🤖 AI Provider: GROQ
Actual: No logs
```

**Solutions**:
1. **Check dev mode**: Logs only show in development
2. **Open correct console**: Browser dev tools (F12)
3. **Clear console**: Refresh and try again
4. **Check log level**: Ensure "All" or "Info" selected

#### **Problem**: Network requests not visible
**Solutions**:
1. Open Network tab in dev tools
2. Filter by "Fetch/XHR"
3. Look for requests to `api.groq.com` and `api.openai.com`

---

### **4. Performance Issues**

#### **Problem**: Groq operations are slow (>5 seconds)
**Debug Steps**:
1. Verify console shows "GROQ API Request"
2. Check network tab for actual API calls
3. Test Groq API key directly

**Possible Causes**:
- Actually using OpenAI (check provider logs)
- Network connectivity issues
- Groq service slowdown
- Large request payload

#### **Problem**: All operations timing out
**Solutions**:
1. **Check internet connection**
2. **Verify API keys are valid**
3. **Check rate limits**: Wait and retry
4. **Test keys independently**

---

### **5. API Key Validation Issues**

#### **Problem**: API Key Checker shows "Invalid or Error"
**Debug Steps**:
1. Click browser console while testing key
2. Look for specific error message
3. Test key manually with curl

**Common Errors**:
- `401 Unauthorized`: Invalid key format
- `403 Forbidden`: Key exists but lacks permissions  
- `429 Rate Limited`: Too many requests
- `500 Server Error`: Provider service issue

#### **Problem**: Keys work in other tools but not here
**Solutions**:
1. **Check key permissions**: Must allow chat completions
2. **Verify quota**: Check if free tier exhausted
3. **Test with minimal request**: Use API Key Checker test buttons

---

### **6. Build/Runtime Errors**

#### **Problem**: App won't start after adding keys
```
❌ Error: Cannot read properties of undefined
```

**Solutions**:
1. **Check .env syntax**: No spaces around = sign
2. **Restart completely**: Stop server, restart
3. **Clear cache**: Delete node_modules, npm install

#### **Problem**: Build fails with API service errors
**Solutions**:
1. **Check imports**: Ensure all files properly imported
2. **Verify syntax**: Look for typos in aiApiService.js
3. **Clear build**: `rm -rf dist && npm run build`

---

## 🔍 **Debug Commands**

### **Test API Keys Manually**

**Test Groq Key**:
```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"mixtral-8x7b-32768","messages":[{"role":"user","content":"test"}]}'
```

**Test OpenAI Key**:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
```

### **Browser Console Debug**

**Check API Service State**:
```javascript
// In browser console
import('./aiApiService.js').then(service => {
  console.log('Groq Key:', service.default.hasGroqApiKey());
  console.log('OpenAI Key:', service.default.hasOpenaiApiKey());
});
```

**Force Provider Test**:
```javascript
// Test specific provider
aiApiService.makeRequest([{role: 'user', content: 'test'}], {forceOpenAI: true})
```

---

## 📊 **Expected Behavior Reference**

### **Correct Console Output Example**
```
🤖 AI Provider: GROQ
📝 Request: Convert this scene description into structured JSON...  
⚙️ Options: {model: undefined, forceOpenAI: undefined, temperature: 0.3}
GROQ API Request attempt 1/3
✅ GROQ Success: {
  model: "mixtral-8x7b-32768", 
  usage: {prompt_tokens: 45, completion_tokens: 123}, 
  responseLength: 245
}
```

### **Provider Selection Logic**
- **Text Operations**: Default to Groq (faster, cheaper)
- **Image Operations**: Force OpenAI (vision capability)
- **Manual Override**: `forceOpenAI: true` always uses OpenAI
- **Model Detection**: Any model containing 'gpt-' uses OpenAI

---

## 🆘 **Getting More Help**

### **Information to Collect**
1. **Browser console logs** (full error messages)
2. **Network tab requests** (which APIs called)
3. **API Key Checker status** (screenshot)
4. **Steps to reproduce** the issue
5. **Expected vs actual behavior**

### **Quick Health Check**
1. API Key Checker shows green ✅ for both
2. Console shows correct provider for each operation
3. Response times reasonable (Groq fast, OpenAI slower)
4. No 401/403 errors in network tab

**Most issues are environment setup related - double-check your .env file first!** 🔧