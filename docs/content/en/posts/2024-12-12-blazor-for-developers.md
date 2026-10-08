---
title: "Blazor for Developers"
date: 2024-12-12
categories: [blazor, dotnet]
tags: [blazor, rendering, ssr, interactive, dotnet]
lang: en
excerpt: "A deep-dive into Blazor's rendering modes: SSR, Interactive, and Hybrid."
---
![cover](~/images/posts/blazor-developers/cover.png)
**[German version](https://github.com/AlexNek/Blazor-for-You/blob/master/ForDevelopers/readme-de.md)**

## Overview
In this article, we won't go over another basic Blazor tutorial. Many resources already cover that topic. Instead, we'll focus on specific challenges that developers might face when using the new rendering modes in .NET 8 and later.

The article is not straightforward because there is a lot of information in it and I have tried to break it down.
![image](~/images/posts/blazor-developers/article.png)

For examples, visit the [example repository](https://github.com/AlexNek/BlazorNet8PlusExamples). You can also find a detailed [description of the examples](https://github.com/AlexNek/BlazorNet8PlusExamples/blob/master/README.md). Alternatively, you can jump straight to the demos: [Demo 1](https://blazornet9rendermodes.azurewebsites.net) or [Demo 2](https://blazorauthentication202412.azurewebsites.net).

## Introduction to Blazor's New Rendering Modes

Blazor’s gotten some cool updates recently, giving developers new ways to render content in .NET 8 and beyond. Instead of sticking to one rigid approach, you can now mix things up based on what your app really needs.

Let’s break it down:  

- **Static (SSR)**: Think of this as delivering ready-made content directly to your users. The server sends fully-rendered HTML, so pages load quickly and look great for search engines. This is perfect for scenarios where speed and SEO matter most, like public-facing websites or blogs. 

- **Interactive (Server or Client)**: When your app needs to feel responsive and dynamic, interactive rendering steps in. It starts by sending pre-rendered content for a quick load, but then shifts into either client-side updates using WebAssembly or server-driven updates with Blazor Server. It’s ideal for dashboards or apps requiring constant user interaction.  

- **Hybrid (Auto)**: Not everything in an app fits neatly into one box, and that’s where hybrid mode shines. It blends the benefits of SSR and interactivity, starting with server-side content for speed and then switching to client-side rendering when needed. It’s a great choice for apps that demand both flexibility and performance.

While these modes offer a flexible approach, combining speed, interactivity, and control, they also increase development complexity.

## Choosing the Right Mode

Deciding how your app should render isn’t just about a single choice—it’s about understanding the unique needs of your application. With Blazor’s flexible rendering options, you can match each part of your app to its specific purpose, ensuring both performance and a great user experience.

![image](~/images/posts/blazor-developers/render-modes.png)

### Render Modes Across Levels  

Blazor doesn’t lock you into one rendering strategy for the entire application. Instead, you can fine-tune it at three different levels:  

- **Application Level:** Define a default rendering strategy for the entire application. For example, if the majority of your pages prioritize quick loading and strong SEO performance, adopting SSR as the global default would be a practical choice. Additionally, you can fine-tune rendering approaches at other levels to suit specific needs.

- **Page Level:** Override the app-wide setting for specific pages. A page with complex interactivity, like a dashboard or live chat interface, might use an Interactive mode to ensure real-time updates.  

- **Component Level:** Take control of individual elements by assigning render modes to specific components. For example, a product page can use SSR for its layout but include an Interactive component for a shopping cart or review section.  

This structure gives you the power to adapt your app’s behavior at every level, balancing performance, scalability, and interactivity exactly where it’s needed.  


### Adaptability of Render Modes

Blazor gives you the option to choose between **fixed** and **variable** render modes, depending on how flexible you want your app to be:  

- **Fixed Mode:** Sticks to a single rendering method—like SSR or Interactive—throughout the app’s lifecycle. It’s straightforward and works well for static pages or areas with limited interactivity.  

- **Variable Mode:** Adapts dynamically, shifting rendering modes based on what’s happening in the app. For example, a product page might start with SSR for fast loading and SEO but switch to Interactive mode for features like adding items to a shopping cart.  

Variable modes are especially useful for apps where different parts serve very different purposes. Just keep in mind that managing these transitions smoothly is key to keeping the user experience seamless.  

### Factors to Consider When Choosing a Mode  

When choosing between SSR and Interactive modes, it’s essential to evaluate the specific needs of your application. Factors such as performance, scalability, user experience, and operational requirements play a crucial role in determining the best approach. You can find a detailed comparison of these core features, highlighting the capabilities, limitations, and scenarios best suited for each render mode **--> 

## Factors to Consider When Choosing a Mode

In this section, we will go into the details of key factors that should guide your decision when choosing between SSR and Interactive modes:

1. Core Rendering and Interaction Features
2. State and Navigation
3. JavaScript and External Interop
4. User Experience Features
5. Advanced Developer Features
6. Scalability and Performance Considerations
7. Security Considerations
8. Deployment and Hosting
9. Development and Debugging
10. Transitioning Between Modes
11. Advanced Developer Features
12. Additional Considerations

---

### 1. Core Rendering and Interaction Features
As the foundation of rendering, these features set the stage for understanding the technical capabilities and limitations of each mode.

| Factor                  | SSR (Static Server Render) | Interactive Server | Interactive Client  |
|--------------------------|----------------------------|--------------------|---------------------|
| **Initial Load Performance** | **Faster initial load**: Prerendered HTML is sent immediately | **Moderate**: Initial load includes some interactivity setup | **Slower**: Requires loading and initializing client-side resources |
| **User Interaction** | **Limited**: Static content only until browser-side rendering begins. | **Partial**: Server-driven interactivity with potential latency | **Full**: Immediate client-side interactivity once client-side resources loaded |
| **Dynamic Content Updates** | **Not supported**: Requires full page refresh | **Supported** via server roundtrips | **Fully supported**: Real-time updates without page refresh |
| **Event Handling** | **Not supported** on initial render | **Handled** on server with network latency | **Handled immediately** on client |
| **OnAfterRenderAsync** | **Not triggered**: Only invoked after interactive rendering | **Triggered** on server with potential network latency to client | **Fully supported**: Instant in-browser execution with no latency once client-side resources are loaded |


---

### 2. State and Navigation

State management and navigation are fundamental aspects of building interactive web applications, closely following rendering.

| Factor                  | SSR (Static Server Render) | Interactive Server | Interactive Client  |
|--------------------------|----------------------------|--------------------|---------------------|
| **State Management** | **Limited**: Relies on server-side solutions like in-memory storage, distributed caching, databases, etc. | **Supported**: State is managed on the server, often using SignalR for real-time updates | **Fully supported**: Rich client-side state management options using frameworks like Redux or MobX |
| **State Persistence** | **Limited**: State can be persisted using various storage mechanisms on the server. This allows for session state management across multiple requests, even though each request is stateless. | **Supported**: State persists during the session on the server | **Fully supported**: Client-side state persistence across interactions, even offline |
| **Navigation Manager** | **Limited**: Can only navigate via server-side redirection | **Supported**: Allows client-side navigation with SPA-like functionality using SignalR | **Fully supported**: Supports client-side navigation with full SPA functionality |

**Notes:**

1. **State Management:**
   - SSR relies on server-side mechanisms such as in-memory storage, distributed caching, databases, etc, which can be limiting for dynamic applications. Components are rendered as static HTML.
   - Interactive Server manages state on the server, providing real-time updates but requiring a constant connection.
   - Interactive Client offers robust client-side state management with various libraries and tools.

2. **State Persistence:**
   - SSR requires reloading state with each request due to its stateless nature. While it is possible to persist state using various storage mechanisms on the server, any state information must be reloaded with each request, which can lead to inefficiencies and increased load times.

3. **Navigation Manager:**
   - SSR typically handles navigation through full page reloads. See 

## Handling `NavigationManager.NavigateTo()` Exceptions in Blazor SSR

### Understanding the Issue

In .NET 8/9 Blazor Server-Side Rendering (SSR), using `NavigationManager.NavigateTo()` can raise exceptions due to its current limitations in SSR mode. This issue is documented in the following GitHub discussions:
- [NavigationManager.NavigateTo() Inconsistent Behavior](https://github.com/dotnet/aspnetcore/issues/53996)
- [NavigationException raised when using NavigationManager.NavigateTo upon form post in SSR](https://github.com/dotnet/aspnetcore/issues/50478)

Until Microsoft provides an official fix, developers can explore several workarounds.

---

### Workarounds

#### 1. Server-Side Redirects
For straightforward scenarios, you can use server-side code to redirect the browser to the desired URL.
- Direct Control: Employ `context.Response.Redirect("/your-route")` within your server-side code.

 **Example:**

 ```csharp
@code {
    [CascadingParameter] 
    public HttpContext? HttpContext { get; set; }

    protected override void OnInitialized()
    {
        HttpContext?.Response.Redirect("/new-page");
    }
}
 ```

#### 2. Custom Extension Method for `HttpContext`
- Encapsulate the redirect logic in an extension method to make your code more reusable and cleaner.

 **Extension Method:**

 ```csharp
public static class BlazorSsrRedirectManagerExtensions 
{
    public static void RedirectTo(this HttpContext httpContext, string redirectionUrl) 
    {
        httpContext.Response.Headers.Append("blazor-enhanced-nav-redirect-location", redirectionUrl);
        httpContext.Response.StatusCode = 200;
    }
}
 ```

#### 3. Custom Middleware
- For more complex redirect logic based on conditions, create middleware to handle requests globally.

#### 4. Adjust Debugging Settings

In development, you can configure Visual Studio to ignore this exception while debugging.

#### 5. Wait for an Official Fix
This issue is actively being tracked on GitHub. Keep an eye on updates from the .NET team.

---
### Conclusion

While these workarounds provide temporary solutions, they might not address all scenarios. Keep your project updated to benefit from any official fixes in future .NET releases.
 too.
   - Interactive Server can provide smoother navigation experiences similar to Single Page Applications (SPAs) using technologies like SignalR.
   - Interactive Client fully supports SPA navigation, offering seamless transitions without full page reloads.

---

### 3. JavaScript and External Interop
Interop capabilities are critical for integrating with external libraries and adding advanced client-side functionality.

| Factor | SSR (Static Server Render) | Interactive |
|--------|----------------------------|-------------|
| **JavaScript without Return Value** | **Partially supported**: Enqueue calls for later execution on the web client. | **Fully supported**: Immediate execution of JavaScript functions. |
| **JavaScript with Return Value** | **Not supported**: Cannot execute JavaScript requiring return values. | **Fully supported**: Allows calling JavaScript functions and retrieving return values. |
| **C# Callback from JavaScript** | **Not supported**: Cannot invoke C# methods from JavaScript in this mode. | **Fully supported**: JavaScript can call C# methods directly with parameters. |
| **`IJSRuntime` Support** | **Not supported**: JavaScript interop with `IJSRuntime` is not supported in SSR mode because there is no active Blazor runtime on the server-rendered page. Plain JavaScript must be used instead. | **Fully supported**: `IJSRuntime` is available for invoking JavaScript functions and passing data between Blazor and the client-side JavaScript. |

**Note**: In **SSR mode**, JavaScript interop using **`IJSRuntime`** is not available since the Blazor runtime has not yet been initialized on the client. Any JavaScript needed before hydration must be executed via standard HTML and JavaScript. Once the page is hydrated and Blazor becomes interactive, you can use **`IJSRuntime`** for more dynamic interactivity.

---

### 4. User Experience Features
These directly impact how the application feels to users, making them a natural follow-up to interactivity and navigation.

| Factor                  | SSR (Static Server Render) | Interactive |
|------------------------------|--------------------------------|-----------------|
| **Form Validation**          | **Server-side only**: Requires round trips for validation logic        | **Fully supported**: Real-time client-side validation supported |
| **SEO and Metadata Rendering** | **Fully supported**: Content is fully server-rendered and crawlable   | **Partially supported**: Requires additional effort for crawlers to process dynamic content |
| **Offline Support**          | **Not supported**: Fully server-dependent                              | **Supported**: Possible with Blazor WebAssembly                |

---

### 5. Advanced Developer Features
Ensuring the application is usable for everyone is a logical progression after covering core user experience aspects.

| Factor                  | SSR (Static Server Render) | Interactive |
|------------------------------|--------------------------------|-----------------|
| **HttpContext Visibility**   | **Supported**: Available during server-side execution                  |  **Not Supported**: Not directly accessible after transitioning to the client  |
| **RenderFragment**           | **Supported**: RenderFragment can be used but limited to static context  | **Fully supported** for app and pages render mode declaration<br>**Not supported** for component render mode declaration |
| **Error Handling**           | Server-side errors can be caught and handled during rendering. Fallback content or error pages can be served | Client-side runtime errors must be managed in the UI, typically using error boundaries or try-catch blocks. Server errors during API calls need separate handling        |


---

### 6. Scalability and Performance Considerations

Performance and scalability are important for both user experience and system design. They connect user-focused aspects with technical and operational concerns.

| Factor | SSR (Static Server Render) | Interactive Server | Interactive WebAssembly |
|---|---|---|---|
| **Server Load** | **Higher**: Every user interaction involves a server request | **Moderate**: Server handles UI updates and state management, but less frequent than SSR | **Lower**: Client-side rendering reduces server load |
| **Initial Load Time** | **Faster**, especially for static content | **Faster** than WebAssembly, but slower than SSR | **Slower** due to .NET runtime and app bundle download |
| **Bandwidth Usage** | **Minimal**: Sends only the necessary HTML and assets for the initial load. | **Moderate**: Continuous SignalR connection for real-time updates | **Higher**: Requires initial download of .NET runtime and application bundle |
| **Concurrent Users** | **Limited**: By server capacity, as each user session requires resources | **Scales** with additional servers, but has limitations due to SignalR infrastructure and the complexity of the application | **Scales well**: As client-side processing reduces server load |
| **Network Latency Impact** | **Less affected** by network delays. | **Highly affected** by network delays, especially for real-time updates. | **Highly affected** by network delays, especially for real-time updates. <br> **Can function offline** or on unreliable networks after the initial load. |

**Note:** While Interactive Server offers better scalability than SSR, it still relies on server resources for UI updates and state management. Interactive WebAssembly, on the other hand, can scale better by offloading processing to the client-side.

---
### 7. Security Considerations

Security is crucial for protecting applications, data, and users, so it must be addressed before deployment.

| Factor | SSR (Static Server Render) | Interactive Server | Interactive Client |
|---|---|---|
| **Sensitive Data Handling** | **Safer**: Data is processed and stored on the server, reducing exposure. | **Safer:** Sensitive data is primarily handled on the server, minimizing client exposure. | **Riskier:** More data and logic are exposed to the client-side, increasing potential vulnerabilities |
| **Authentication** | Fully supported with server-side sessions or cookies, ensuring secure management | Fully supported with server-side sessions or token-based authentication, providing robust security | Fully supported, often using token-based authentication, but requires careful handling to prevent token exposure |
| **Cross-Site Scripting (XSS)** | **Lower risk:** No client-side execution during the initial load, reducing XSS vectors | **Lower risk:** Server-side rendering minimizes direct client exposure to XSS | **Higher risk:** Requires careful sanitization of client-side inputs and output encoding to prevent XSS attacks |

**Notes:**
- SSR and Interactive Server process data on the server. This helps keep sensitive information safe and prevents it from being seen by clients.
- Interactive Client applications must implement robust security practices to mitigate risks associated with client-side data exposure and manipulation.
- Authentication mechanisms are generally robust across all models but require careful implementation to ensure tokens or session identifiers are not exposed.

---

### 8. Deployment and Hosting
With security in mind, deployment and hosting become the next logical step, covering how to operate the application effectively.

| Factor                  | SSR (Static Server Render) | Interactive Server | Interactive Client  |
|--------------------------|----------------------------|--------------------|---------------------|
| **Hosting Requirements**     | Requires a capable server to handle SSR requests (e.g., ASP.NET Core) | Requires a server to manage real-time interactions (e.g., SignalR) | Can run entirely on static hosting platforms |
| **Edge or CDN Support**      | **Limited**: Requires origin server for dynamic rendering. Modern CDNs can cache some dynamic content but are still reliant on server processing | **Limited**: Real-time updates depend on server connections; modern CDNs can help accelerate delivery | **Fully supported**: Static resources can be cached globally, while dynamic content is processed client-side |
| 

## Core Concept

Progressive Enhancement means creating a website that:

1. Works for all users, regardless of their device or browser
2. Starts with basic content and functionality
3. Adds more advanced features for users with modern browsers or better internet connections

## How It Works

Think of it like building a cake:

1. **Base layer (HTML):** The basic content everyone can access
2. **Middle layer (CSS):** Improves the look and layout
3. **Top layer (JavaScript):** Adds interactive features and enhancements

## Benefits

- **Accessibility:** Ensures content is available to all users
- **Performance:** Faster loading times for basic content
- **Flexibility:** Works across different devices and browsers

## In Simpler Terms

It's like designing a car that:
- Has a basic model everyone can drive
- Offers luxury features for those who can afford them
- But still gets you from A to B, no matter which version you have

Progressive Enhancement is about creating websites that are inclusive and adaptable.
  | **Fully supported**: Works even in environments 

## How Progressive Enhancement Works in SSR Mode

1. **Core HTML Delivery:** The server generates and sends fully-rendered HTML to the client, providing immediate access to essential content and functionality, even without JavaScript.

2. **Layered Approach:** The application is built in layers, starting with semantic HTML, then adding CSS for styling, and finally JavaScript for enhanced interactivity.

3. **Baseline Functionality:** All core features work using standard HTML elements like forms and links, ensuring usability even without JavaScript.

4. **JavaScript Enhancements:** Once the page loads, JavaScript adds additional interactivity and features, improving the user experience.

5. **Fallback Mechanisms:** While the site functions without JavaScript, some features may have simpler fallbacks.

6. **Semantic HTML Foundation:** The core is built on well-structured, semantic HTML, ensuring accessibility across various devices and browsers.

By implementing Progressive Enhancement in SSR, developers create robust applications that provide a consistent experience. Core content and essential functionality remain accessible, even if some advanced features are not available when JavaScript is disabled.
 | **Partially supported**: Requires JavaScript for real-time interactions. | Requires JavaScript for functionality beyond initial load. |

**Notes:**

- **Hosting Requirements:** SSR and Interactive Server both require server resources, but Interactive Client (WebAssembly) can be hosted on static platforms, reducing infrastructure needs.
- **Edge or CDN Support:** Interactive Client benefits from global caching of static assets, while SSR and Interactive Server have limitations due to their reliance on server-side processing, although modern CDNs can optimize dynamic content delivery.
- **Progressive Enhancement:** SSR supports environments without JavaScript, whereas both Interactive Server and Client rely on JavaScript for full functionality.

---

### 9. Development and Debugging

Once hosting is addressed, focus shifts to how developers work with these modes during the development cycle.

| Factor | SSR (Static Server Render) | Interactive Server | Interactive Client |
|---|---|---|---|
| **Development Complexity** | **Lower**: Simple, traditional server-side rendering model | **Moderate**: Combines server-side logic with real-time browser interactions, leveraging existing server-side frameworks | **Higher**: Requires both client-side and server-side logic, often needing more complex tooling |
| **Debugging Tools**       | Standard server-side debugging tools              | Combination of server-side and browser debugging tools | Primarily browser-based debugging tools         |
| **Hot Reload Support**    | **Fully supported** in server-side development    | **Supported**, with changes synced to the client  | **Supported**, with changes synced to the client |

**Notes**:
1. **IDE Support Across Modes**:  
   - All major IDEs, including **Visual Studio**, **JetBrains Rider**, and **VS Code**, fully support debugging across SSR, Interactive Server, and Interactive Client modes.  
   - Features like **Hot Reload**, **breakpoints**, and **WASM debugging** are widely available and straightforward to set up.  

2. **Historical Context of Complexity**:  
   - Earlier debugging workflows, particularly for WASM and Interactive Client, required additional setup, especially in IDEs like VS Code. This created the perception of higher complexity.  
   - Over time, improved tooling across all IDEs has streamlined the debugging experience, removing many of the barriers once encountered.  

3. **Browser-Based Debugging Tools**:  
   - In **Interactive Client** and **WASM** modes, browser-based debugging tools (like Chrome DevTools or Edge Developer Tools) are essential.  
   - Some debugging aspects, such as DOM manipulation, JavaScript execution flow, and client-side performance profiling, are **only possible** within the browser’s developer tools.  
   - These tools offer unique features like real-time inspection of the DOM, breakpoints for JavaScript, performance profiling, and the ability to directly interact with the browser environment, which cannot always be fully replicated within IDEs.  
   - Thus, developers should use a combination of IDE and browser tools to achieve complete debugging capabilities when working with client-side or interactive Blazor applications.  

---

### 10. Transitioning Between Modes
After understanding development and hosting, this section explains how to handle transitions and hybrid scenarios.

| Factor | SSR (Static Server Render) | Interactive Server | Interactive Client | Interactive Auto |
|---------|----------------------------|--------------------|--------------------|-------------------|
| **State Preservation** | **Manual**: Requires passing state between requests | **Automatic**: State persists on the server during the session | **Automatic**: State persists in the client's browser | **Adaptive**: State preservation depends on the chosen render mode for each component |
| **Dynamic Mode Switching** | **Supported**: Can transition to either Interactive mode. Switching to Interactive Client typically requires a full reload | **Supported**: Can transition from SSR with minimal disruption due to persistent connection | **Supported**: Can transition from SSR, but typically requires a full reload and additional loading of WebAssembly runtime | **Dynamic**: Chooses render mode based on current context, can switch between Server and Client modes |
| **Resource Reuse** | Server resources are reused across requests, but not shared with client. | Server resources are reused across requests and SignalR connections | Client resources persist locally, server resources accessed via API calls | Adapts resource usage based on chosen render mode |

**Notes:**

1. **State Preservation**:
   - For **Interactive Server**, state is maintained on the server during the session.
   - For **Interactive Client**, state is maintained in the browser.
   - For **Interactive Auto**, state preservation adapts based on the chosen render mode for each component. It does not automatically preserve state across different render modes.

2. **Dynamic Mode Switching**  
   - **Mode Transitions:** Switching between render modes is supported, but each transition requires careful consideration of its implications.  
   - **Interactive Auto Mode:** This mode dynamically determines the appropriate render mode (Server or Client) based on the current context and the level of interactivity on the page. It prioritizes selecting a render mode that aligns with the existing interactive components to avoid creating a new interactive runtime that lacks shared state.  
   - **Per Component/Load Decisions:** Auto mode evaluates and decides the render mode for each component or page load independently, rather than applying a fixed mode for the entire session.  
   - **Stateful Services Warning:** Use caution with stateful services, as the selected render mode may shift between server-based and client-based services, potentially impacting state management.     
   
3. **Resource Reuse**:
   - In SSR and Interactive Server, server-side resources can be reused across requests but are not shared with the client.
   - In Interactive Client, resources are managed locally in the browser, with server resources accessed via API calls.
   - Interactive Auto adapts its resource usage based on the chosen render mode for each component.

4. **Mode Transition**:

 Important things to consider when switching between modes:

 - **Cascading Parameters**:
    - Ensure cascading parameters are correctly re-established during transitions to avoid null references.
    - Provide fallback defaults where necessary.

 - **Parameter Serialization**:
    - Maintain data integrity during serialization and deserialization.
    - Check type compatibility between serialized and deserialized formats.
    - Don't forget to include a default constructor if required by the serialization framework.

 - **Parameter Serialization Size**:
    - Minimize the size of parameter objects to enhance performance during transitions.
    - Consider lazy loading or transferring only essential data to reduce payload size.

 - **State Synchronization**:
    - Implement state hydration to ensure that changes in one mode reflect accurately when transitioning to another mode.
    - Maintain consistency across rendering modes to enhance user experience.

---

### 11. Advanced Developer Features
These features are optional but important for advanced use cases, making them suitable for later in the order.

| Factor | SSR (Static Server Render) | Interactive Server | Interactive Client |
|------------------------------|--------------------------------|-----------------|
| **

## ARIA (Accessible Rich Internet Applications)

### What is ARIA?

ARIA is a set of HTML roles and attributes developed by the W3C to enhance web content for users who rely on assistive technologies like screen readers.

### Purpose of ARIA

- **Enhance Accessibility:** Provides additional semantic information about elements.
- **Define Roles and Attributes:** By defining roles (e.g., "button", "alert") and attributes (e.g., "aria-label", "aria-hidden").

### Why Use ARIA?

- Native HTML elements do not provide enough accessibility support.
- Creating complex, interactive web applications where native HTML cannot fully describe behavior.

### Key Benefits

- **Improved Accessibility:** More accessible to users with disabilities.
- **SEO Benefits:** Helps improve search engine optimization.
- **Maintainability:** Makes code more readable.

---

### Semantic HTML

Semantic HTML refers to using HTML elements according to their intended purpose, providing meaningful context.

#### Key Differences Between ARIA and Semantic HTML

- **Native Support vs. Supplementation:** Semantic HTML provides built-in accessibility. ARIA supplements when more complex interactions are needed.
- **Use Cases:** Always prefer semantic HTML for basic structure. Use ARIA to enhance in complex applications.

#### Combining ARIA with Semantic HTML

By combining ARIA attributes with semantic HTML, developers create web applications that are both accessible and user-friendly.
** | **Fully supported**: Markup is static and follows standards easily | **Fully supported**: Server generates accessible markup, but requires careful handling of dynamic updates | **Fully supported**: Requires careful implementation to ensure dynamically generated content is accessible |
| **Keyboard Navigation** | Supported for basic interactions: Native browser features like `Tab` navigation and form submission are available. <br>**Limitations:** Complex interactions (e.g., custom key bindings or real-time updates) are not supported and require Interactive mode | **Supported**, but requires proper event handling on the server for custom interactions | **Supported**, but requires proper event handling in client-side code for custom interactions |
| **Screen Reader Compatibility** | **Fully supported**: Prerendered content works seamlessly with screen readers | **Supported**, but real-time updates require careful implementation to ensure screen readers announce changes | **Supported**, but requires careful implementation to ensure dynamically updated content is properly announced by screen readers |

**Notes:**

1. **ARIA and Semantic HTML**: All modes can support this, but interactive modes require more attention to ensure dynamically updated content remains accessible.

2. **Keyboard Navigation**: While basic navigation is supported in all modes, custom interactions in interactive modes require specific implementation to ensure keyboard accessibility.

3. **Screen Reader Compatibility**: SSR has an advantage in initial content accessibility, but both interactive modes can achieve good compatibility with proper implementation of dynamic content updates.

---

### 12. Additional Considerations
This section wraps up with miscellaneous factors that don't fit neatly into other categories but are still important to consider.

| Factor | SSR (Static Server Render) | Interactive Server | Interactive Client |
|------------------------------|--------------------------------|-----------------|
| **Offline Mode** | Limited: Can work with service workers for basic offline content, but dynamic features require server connection. | Limited: Requires constant connection to the server for full functionality. | Supported: Can enable full offline functionality with proper implementation. |
| **Progressive Web App (PWA)** | Partially supported: Can implement some PWA features, but limited by server dependency. | Partially supported: Can implement some PWA features, but limited by server dependency. | Fully supported: Works seamlessly with PWA features, including offline functionality. |
| **Caching Strategies** | Works with traditional server-side caching mechanisms and CDNs. | Combines server-side caching with SignalR connection management for optimized performance. | Leverages client-side caching and service workers for improved performance and offline capabilities. |

**Notes:**

1. **Offline Mode**: 
   - SSR and Interactive Server have limitations due to server dependency.
   - Interactive Client (WebAssembly) offers the best support for offline functionality.

2. **Progressive Web App (PWA)**:
   - All modes can implement some PWA features, but Interactive Client offers the most comprehensive support.

3. **Caching Strategies**:
   - Each mode has different caching approaches, with Interactive Client offering the most flexible client-side caching options.
 <--**.

#### Quick Comparison: SSR, Interactive, and Hybrid Modes
Here’s a **Quick Comparison** table summarizing the key differences between **SSR**, **Interactive**, and **Hybrid** modes. 

| Factor  | SSR (Static Server Render) | Interactive (Server) | Interactive (Client) | Hybrid (Auto)|
|---------|----------------------------|----------------------|----------------------|--------------|
| **Rendering Location**          | Server-side only                                                    | Server-side for initial load; browser client-side for interactivity (via Blazor Server) | Client-side rendering after initial server-side load (via WebAssembly) | Server-side for initial load; transitions to client-side (WebAssembly or Blazor Server) as needed |
| **Initial Load Speed**          | Fast (pre-rendered HTML sent directly)                             | Moderate (some setup needed for interactivity)           | Moderate (initial WebAssembly load time, but fast after that) | Fast (initially SSR, then client-side takes over)                |
| **Interactivity**               | Limited (static content until client-side takes over, if applicable)               | Full interactivity after client-side resources are loaded (via Blazor Server) | Full interactivity after the client-side resources are loaded (via WebAssembly) | Full interactivity after server-side initial load, with a transition to client-side interactivity |
| **SEO**                         | Excellent (fully rendered content sent to the client)              | Moderate (dynamic content requires additional handling for SEO)  | Moderate (dynamic content requires additional handling for SEO) | Good (initial SSR provides SEO benefit, but dynamic content requires client-side handling) |
| **State Management**            | Server-side (no client-side state)                                 | Server-side (SignalR for real-time updates) | Client-side (client manages most state via WebAssembly) | Mix of server and client-side state (depends on transition) |
| **Use Case**                    | Best for static or mostly-static websites (e.g., blogs, news sites) | Best for real-time dashboards, apps with high user interactivity | Best for single-page apps or apps requiring client-side interactivity and offline support | Best for apps needing both quick load and dynamic features (e.g., e-commerce) |
| **Scalability**                 | Limited by server capacity (every user request requires server processing and resources) | Scales better than SSR by reducing server load with server-side interactivity, but still relies on server for dynamic updates and socket connections for SignalR | Scales very well since most of the processing happens client-side, reducing server load significantly | Scales well, especially with client-side processing once the initial page is loaded, reducing server dependency |
| **Offline Support**             | Limited (requires a server connection)  |Limited (depends on server connection for real-time interactions)     | Full support for client-side with progressive enhancement  | Initially limited, then full support with client-side progressive enhancement after transition        |


### Developer Gotchas: Render Mode Pitfalls
Sometimes, developers may expect certain behaviors, but things work differently. 
Pay attention to these important points:

| Feature | SSR (Static Server Render)  | Interactive (Server) | Interactive (Client)  |
|---------|-----------------------------|----------------------|-----------------------|
| **OnInitializedAsync**  | Called once | Called twice: once during prerendering, and once when transitioning to interactivity | Called twice: once during prerendering, and once when transitioning to interactivity      |
| **OnAfterRenderAsync**  | Not Called | Called immediately after server rendering | Called immediately after client rendering       |
| **HttpContext Access**  | Fully available during server-side prerendering  | Limited to server-side logic.            | Not available                          |
| **NavigationManager**   | Limited to server-driven navigation                                 | Fully supported for SPA-like behavior  | Fully supported for SPA-like behavior  |
| **JavaScript Interop** | Limited (static JS possible, no dynamic interop) | Available after initial load (via SignalR) | Fully available (after WASM load) | Initially limited, then fully available after transition to client-side rendering |
| **RenderFragment**      | Static only during SSR  | Fully supported for page and application wide render mode | Fully supported for page and application wide render mode                                     |
| **Error Handling**      | Displays fallback content or error pages                            | Requires custom error boundaries   | Requires custom error boundaries                    |
| **DOM Cleanup Tasks**   | May need custom handling as DOM might not exist during disposal | Fully supported                                    | Fully supported                                  |

**Note:**
- **Prerendering in Interactive Modes**: In **Hybrid** and **Interactive Server** modes, **prerendering** is enabled by default, meaning that the component is first rendered on the server as static HTML. Then, once the WebAssembly or Blazor Server is loaded on the client side, the component becomes interactive and reinitializes. This results in **`OnInitializedAsync` being called twice**: once during **server-side prerendering** and again when the app transitions to interactivity on the client.

### Choosing the Right Mode - Summary
Choosing the right rendering mode in Blazor is a complex decision that requires careful consideration of multiple factors. While the all tables provided earlier in this chapter offer detailed comparisons across various aspects, it's important to remember that there's no one-size-fits-all solution. The best approach often involves a combination of rendering modes tailored to your application's specific needs. Consider factors like SEO, performance, and interaction complexity.

Remember that Blazor's flexibility allows you to mix and match rendering modes within a single application. Start by dividing your application into components and identifying which ones require interactivity and which can remain static. This process may require iteration to find the optimal balance.

#### Example Use Cases
| Scenario               | Recommended Mode                |
|----------------------------|-------------------------------------|
| Blog or news site          | SSR                                |
| Real-time dashboard        | Interactive                        |
| E-commerce product pages   | SSR for catalog, Interactive for cart |
| Single-page app (SPA)      | Interactive                        |
| Hybrid application         | Variable (SSR to Interactive)      |


## Component and Service Placement
When developing a Blazor application, deciding where to place components and services is crucial for ensuring optimal performance and security. The placement of these elements should be considered carefully to ensure your application runs efficiently and meets the necessary security requirements.


### Component Placement

When deciding where to place components in a Blazor application, consider the selecting render mode first. The table below summarizes the appropriate placements for different component types:

| Component Type    | Server  | Client | Shared  |
|-------------------|---------|--------|---------|
| **Server-Specific Logic**     | **Yes**: Place on the server for secure processing and access to server resources. | **No**: Not suitable for client-side due to reliance on server logic. | **No**: Only relevant in a server context.      |
| **Interactive UI Elements**   | **Yes**: SSR and Interactive Server rendering mode| **Yes**: Interactive Client and interactive Auto mode | **Yes**: Components without render mode defintion. Could be defined by using per instance |
| **Data Access Components**    | **Yes**: Recommended for security and direct access to databases. | **Yes (with caution)**: Use only if data can be securely accessed without exposing sensitive information. | **Yes**: Can be shared if used in both modes, but ensure security practices are followed. |
| **Authentication Components** | **Yes**: Essential for managing user sessions securely on the server. | **No**: Client-side authentication should be handled cautiously to avoid exposing sensitive data. | **Limited**: Shared components can manage authentication but should prioritize security. |

**Note**:
1. **Data Access Strategy**:
   - Evaluate where your data is stored and how it will be accessed; place data access components on the server when security is a priority.
   - If using APIs, consider whether those APIs can be accessed securely from the client.

2. **Shared Logic**:
   - For components that need to function in both environments, ensure they are designed to handle differences in execution context (e.g., accessing services or APIs).

3. **Static Components**:
   - Components without rendering mode (default SSR) and without specific service connection could be placed everywhere.


### Service Placement

When developing a Blazor application, the placement and registration of services is also crucial.

#### Server-Side Services
Server-side services are ideal for handling sensitive data and business logic securely. These services should always be registered on the server to minimize exposure to potential vulnerabilities. They can manage tasks such as authentication, data access, and any operations requiring secure processing. 

**Prerendering Consideration:** When using prerendering, remember that server-side services are accessible during the initial rendering phase. However, client-side services are not available at this stage, which means you must register server-side version of client-services for you client components.

#### Transient and Scoped Services
Transient and scoped services can be registered on either the server or client based on their usage needs:

- **Server Registration:** If these services are intended for operations that involve data access or require secure handling of user information, they should be registered on the server.
- **Client Registration:** If the services are only needed for client-side interactions (e.g., UI state management), they can be registered on the client.

This flexibility allows developers to optimize resource usage and ensure that each service is placed where it will be most effective.


#### Singleton Services
Singleton services are best registered on the server to maintain a single instance throughout the application's lifecycle. This approach ensures consistent behavior across sessions and reduces overhead by avoiding multiple instances of the same service.

**Client Consideration:** Registering singleton services on the client is generally not recommended due to potential state management issues. If you need shared state across different parts of your application, consider using a server-side singleton instead.

### Singleton Services and Rendering Transitions  

In Blazor, **singleton services** are used to maintain a single instance throughout the application's lifecycle. However, they behave differently when switching between rendering modes, such as from server-side rendering (SSR) to client-side rendering (WebAssembly).

- **During Initial Rendering:** When a Blazor component is first rendered on the server, **singleton services** registered on the server are available. This helps maintain shared resources, like authentication or logging, across different components.

- **Prerendering Considerations:** If prerendering is enabled, the component is first rendered on the server before being sent to the client. During this phase, **server-side singleton services** can be used, but **client-side services** won’t be available until the page fully loads on the client. This means that during the early phase, some services may not be accessible, so you must ensure your app can handle this by relying on server-side services until the client-side is ready.

- **Transitioning Between Render Modes:** When switching from SSR to Interactive Server or Interactive Client modes, **server-side singleton services** remain available throughout the app. However, when moving to client-side rendering (like Blazor WebAssembly), those server-side services are no longer directly accessible. To interact with server data, you’ll need to use APIs or other methods.

- **State Management:** Singleton services can help manage app state, but you need to ensure that state is transferred or synchronized properly when switching between server-side and client-side rendering. If this isn’t done, state can get out of sync, causing errors or inconsistent behavior.

### Important Considerations for Developers

- **Scalability and Resource Usage:** When using singleton services in Blazor Server applications with many concurrent users, developers must be cautious about resource consumption and thread safety. Singleton services are shared across all user sessions, which can lead to increased memory usage and potential performance bottlenecks.

- **Thread Safety:** Since multiple users can access the same singleton service simultaneously, it’s crucial to implement thread-safe practices to prevent data inconsistencies.

- **State Synchronization:** Changes made in a singleton service affect all users. Developers should implement mechanisms to ensure that state changes are communicated across different user sessions effectively.

- **Lifecycle Management:** Singleton services persist for the entire application lifetime. Proper cleanup and resource management are necessary to avoid holding onto resources longer than needed.


## Helpful links
If you're looking to dive deeper into Blazor and the various rendering modes, here are some useful resources to guide you through the concepts and implementations:

- [ASP.NET Core Blazor render modes](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes?view=aspnetcore-9.0)
- [Blazor .NET 8 Server-side Rendering (SSR)](https://akifmt.github.io/dotnet/2024-01-16-blazor-.net8-server-side-rendering-ssr/)
- [Everything New in .NET 9: The Ultimate Developer's Guide](https://dev.to/bytehide/everything-new-in-net-9-the-ultimate-developers-guide-331e)
- [Black Belt Blazor - Differences between Interactive Blazor and Static Blazor](https://github.com/devessenceinc/BlackBeltBlazor)
- [Blazor and .NET 8: How I Built a Fast and Flexible Website](https://jeffreyfritz.com/2024/02/blazor-and-net-8-how-i-build-a-fast-and-flexible-website/)
- [Build your first web app with ASP.NET Core using Blazor](https://dotnet.microsoft.com/en-us/learn/aspnet/blazor-tutorial/intro)
- [Creating A Step-By-Step End-To-End Database Server-Side Blazor Application](https://blazorhelpwebsite.com/ViewBlogPost/34)


## Conclusion  

Choosing the right render mode in Blazor is about finding the balance between performance, interactivity, and maintainability. Each mode brings unique behaviors and constraints that can influence how your app operates. For instance, lifecycle events like `OnInitializedAsync` may execute multiple times depending on the mode, and access to features like `HttpContext` might vary based on where the rendering occurs. The choice between Server-Side Rendering (SSR), Interactive Server, Interactive Client, and Auto render modes requires careful consideration and strategic planning.

![image](~/images/posts/blazor-developers/development.png)

**Tips for Success:**  

- **Be Aware of Limitations:** Understand how each render mode affects lifecycle methods, navigation, and interop, so you can avoid surprises.  
- **Tailor to Fit:** Use a mix of render modes to match specific needs in different parts of your app.  
- **Focus on Critical Components:** Identify and prioritize key areas of your application to optimize performance.
- **Optimize What Matters:** Focus on enhancing critical areas that significantly impact performance and user experience.  
- **Iterative Improvement:** Be ready to refine your approach as you gather feedback and learn from how users interact with your application.  
- **Plan for Growth:** Build flexibility into your architecture to adapt as your app scales or requirements shift.  
- **User-First Thinking:** Always prioritize a smooth and intuitive experience for your users—they’re the reason for the app’s existence.  
- **Stay Flexible:** Be prepared to revisit your rendering strategy as your project grows or new challenges emerge.  

Blazor’s flexibility empowers you to craft apps that perform well and adapt to evolving needs. By keeping these principles in mind and planning carefully, you can confidently handle the intricacies of render modes while delivering a seamless, user-focused experience.


<div id="post-nav"></div>
