# MCP-Chrome Setup Guide
## Complete Installation & Configuration

This guide walks you through the final steps to complete the mcp-chrome integration for advanced testing capabilities.

## ✅ What's Already Configured

### 1. MCP-Chrome Bridge ✅
- **Installed**: `mcp-chrome-bridge` is installed globally
- **Registered**: Native Messaging host is registered for Chrome
- **Permissions**: Execution permissions are properly set
- **Configuration**: STDIO config points to `http://127.0.0.1:12306/mcp`

### 2. Testing Scripts ✅
- **Package Scripts**: `test:mcp`, `test:interactive`, `test:design-system`, `test:performance`
- **Test Scenarios**: Comprehensive testing scenarios created (`scripts/mcp-chrome-scenarios.js`)
- **Documentation**: Strategy and comparison docs completed

### 3. Project Integration ✅
- **Multi-agent Workflow**: Ready for agent coordination
- **Performance Monitoring**: Core Web Vitals tracking prepared
- **Design System Validation**: Brand token compliance checking ready

## 🔄 Remaining Manual Steps

### Step 1: Install Chrome Extension

1. **Download Extension**:
   ```bash
   # Visit the GitHub releases page
   open https://github.com/hangwin/mcp-chrome/releases
   
   # Download the latest extension files (v0.0.6 or newer)
   # Look for Chrome extension zip or crx file
   ```

2. **Install in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the downloaded extension folder
   - OR drag and drop the .crx file into the extensions page

3. **Verify Installation**:
   - Extension icon should appear in Chrome toolbar
   - Extension ID should match: `hbdgbgagpkpjffpklnamcljpakneikee`

### Step 2: Test Connection

1. **Start Development Server** (if not running):
   ```bash
   npm run dev
   ```

2. **Start MCP Bridge** (in new terminal):
   ```bash
   # This will start the bridge server on port 12306
   mcp-chrome-bridge
   ```

3. **Test in Chrome**:
   - Navigate to `http://localhost:3000`
   - Open Chrome DevTools (F12)
   - Click on the mcp-chrome extension icon
   - Verify connection status shows "Connected"

### Step 3: Run Initial Tests

1. **Load Test Scenarios**:
   ```javascript
   // In Chrome DevTools Console, paste this:
   const script = document.createElement('script');
   script.src = '/scripts/mcp-chrome-scenarios.js';
   document.head.appendChild(script);
   ```

2. **Execute Test Suite**:
   ```javascript
   // Run complete test suite
   window.mcpChromeTestSuite.runCompleteTestSuite().then(results => {
     console.log('🎯 Quality Score:', results.summary);
   });
   ```

3. **Individual Test Categories**:
   ```javascript
   // Design system validation
   window.mcpChromeTestSuite.runDesignSystemTests();
   
   // UX testing
   window.mcpChromeTestSuite.runUXTests();
   
   // Integration testing  
   window.mcpChromeTestSuite.runIntegrationTests();
   ```

## 🚀 Advanced Usage Scenarios

### Real-time Design System Validation

```javascript
// Monitor brand token usage
await designSystemTests.validateBrandTokens();

// Check typography consistency
await designSystemTests.validateTypography();

// Validate color contrast
await designSystemTests.validateColorContrast();
```

### User Experience Testing

```javascript
// Test consultation booking flow
await userExperienceTests.testConsultationFlow();

// Check mobile responsiveness
await userExperienceTests.testMobileResponsiveness();

// Collect performance metrics
await userExperienceTests.collectPerformanceMetrics();
```

### Component Integration Testing

```javascript
// Validate shared components
await integrationTests.testComponentIntegration();

// Check lazy loading
await integrationTests.testLazyLoading();
```

## 🎯 Testing Workflows

### Development Workflow

1. **Start Development Environment**:
   ```bash
   # Terminal 1: Start dev server
   npm run dev
   
   # Terminal 2: Start multi-agent workflow
   npm run dev-with-agents
   
   # Terminal 3: Start MCP bridge (when needed)
   mcp-chrome-bridge
   ```

2. **Make Design Changes**:
   - Edit components, styles, or content
   - Save changes (hot reload triggers)

3. **Run Real-time Validation**:
   ```javascript
   // Quick validation in Chrome console
   mcpChromeTestSuite.runDesignSystemTests();
   ```

4. **Full Quality Check**:
   ```javascript
   // Complete validation before commit
   mcpChromeTestSuite.runCompleteTestSuite();
   ```

### CI/CD Integration

**For Automated Testing**: Continue using Playwright
```bash
npm test  # Playwright for CI/CD
```

**For Development Testing**: Use mcp-chrome
```bash
npm run test:interactive  # mcp-chrome for development
```

## 📊 Expected Results

### Quality Score Benchmarks

| Category | Target Score | Current Implementation |
|----------|-------------|----------------------|
| **Design System** | 90%+ | Brand tokens implemented |
| **User Experience** | 85%+ | Accessibility optimized |
| **Integration** | 95%+ | Shared components ready |
| **Overall Quality** | 90%+ | Ready for validation |

### Performance Metrics

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: ~15% reduction from lazy loading
- **Test Execution**: < 500ms for complete suite
- **Real-time Feedback**: Instant validation during development

## 🔧 Troubleshooting

### Common Issues

1. **Extension Not Connecting**:
   - Check if mcp-chrome-bridge is running
   - Verify port 12306 is not blocked
   - Restart Chrome and try again

2. **Native Messaging Errors**:
   ```bash
   # Re-register the native host
   mcp-chrome-bridge register
   mcp-chrome-bridge fix-permissions
   ```

3. **Test Scenarios Not Loading**:
   - Check if development server is running
   - Verify script path `/scripts/mcp-chrome-scenarios.js` is accessible
   - Check browser console for errors

4. **Permission Issues**:
   ```bash
   # Fix permissions if needed
   sudo mcp-chrome-bridge fix-permissions
   ```

### Debug Commands

```bash
# Check bridge status
mcp-chrome-bridge --help

# Verify native messaging registration
ls -la ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/

# Test connection
curl http://127.0.0.1:12306/mcp
```

## 🎉 Success Indicators

When setup is complete, you should see:

1. **✅ Chrome Extension**: Icon in toolbar, "Connected" status
2. **✅ Bridge Connection**: No errors in terminal when running bridge
3. **✅ Test Suite**: Returns quality scores when executed
4. **✅ Real-time Validation**: Immediate feedback on design changes

## 📈 Next Steps

Once setup is complete:

1. **Integrate with Multi-Agent Workflow**: Each agent can use mcp-chrome for specialized testing
2. **Establish Testing Routine**: Run validation after each significant change
3. **Performance Monitoring**: Set up continuous Core Web Vitals tracking
4. **Team Training**: Share testing scenarios and best practices

---

**Status**: Ready for final Chrome extension installation
**Time to Complete**: 10-15 minutes
**Benefits**: Real-time testing, preserved browser state, AI-powered analysis