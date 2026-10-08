---
title: "Blazor Component Testing with bUnit"
date: 2025-01-28
categories: [blazor, testing]
tags: [bunit, blazor, testing, xunit, dotnet]
lang: en
excerpt: "A practical guide to testing Blazor components with bUnit, xUnit, and FluentAssertions."
---
![cover](/images/posts/blazor-testing/cover.png)
## Overview

Testing Blazor components doesn’t have to be complicated. With **bUnit**, you can validate component logic, rendering, and behavior without dealing with a full browser setup. This guide walks through the essentials of using bUnit to test components efficiently and effectively.  

We'll cover how to set up **bUnit**, why **xUnit** is a solid choice for running tests, and how **FluentAssertions** can make assertions more readable. You’ll also learn how to mock dependencies, handle JavaScript interop, and manage asynchronous operations—all without leaving the comfort of a simulated testing environment.  

By the end, you’ll have a clear understanding of how to write reliable tests, follow best practices, and know when to reach for tools like Selenium for more comprehensive end-to-end testing.  


# Why We Chose These Tools

## xUnit

When it comes to testing Blazor components, xUnit is our go-to framework. It's modern, straightforward, and packed with useful features that make testing a breeze. Unlike older frameworks that can feel clunky, xUnit is designed with simplicity and flexibility in mind.

So why xUnit? It keeps things clean and organized, supports async tests right out of the box, and runs tests in parallel to speed things up. Plus, it works seamlessly with FluentAssertions, making your test assertions clearer and more readable.

Other options like NUnit and MSTest? Sure, they’ve been around for a while, but they come with their own quirks. NUnit can struggle with managing test instances efficiently, and MSTest just doesn’t offer the same level of flexibility and ease of use. In the end, xUnit is simply a better fit for modern Blazor component testing.

For a more detailed breakdown of why we chose xUnit over other options, see comprehensive 

## xUnit vs. nUnit: A Comparison for Experienced Developers

While both xUnit and nUnit are mature and widely used .NET testing frameworks, they differ in their philosophies and features. This comparison focuses on aspects relevant to experienced developers, particularly in the context of Blazor component testing.

### 1. Test Structure and Attributes

*   **xUnit:** Emphasizes convention over configuration. Uses `[Fact]` for individual test methods and `[Theory]` for data-driven tests with `[InlineData]`, `[MemberData]`, or custom `DataAttribute` implementations. No explicit `[TestFixture]` attribute.
*   **nUnit:** Uses `[Test]` for test methods and `[TestCase]` for data-driven tests. Groups tests using `[TestFixture]` and supports `[SetUp]`/`[TearDown]`.

### 2. Test Lifecycle and Isolation

*   **xUnit:** Creates a new instance of the test class for ***each*** test method. Excellent test isolation, crucial for component testing.
*   **nUnit:** By default, creates a single instance of the test fixture for all tests. Can lead to shared state issues.

### 3. Extensibility and Customization

*   **xUnit:** Designed with extensibility in mind. Uses a provider model. Includes `ITestOutputHelper` for test output.
*   **nUnit:** Also extensible, but xUnit's provider model is generally considered more flexible.

### 4. Data-Driven Tests

*   **xUnit:** `[Theory]` with `[InlineData]`, `[MemberData]` — clean and concise.
*   **nUnit:** `[TestCase]` — functional but xUnit's approach is often considered more elegant.

### 5. Assertions

Both provide built-in assertions. Many developers prefer FluentAssertions for readable syntax.

### 6. Community and Ecosystem

Both have strong communities. xUnit is often perceived as more modern, especially in the .NET ecosystem. It is the default testing framework for ASP.NET Core projects.

### Why xUnit is often preferred for Blazor component testing

*   **Test Isolation:** Per-test-method instance creation prevents state leakage.
*   **Simplicity and Focus:** Convention-based approach for focused unit tests.
*   **Extensibility:** Provider model for easy integration with Blazor testing libraries.
*   **Test Output:** `ITestOutputHelper` for test output.
*   **Modern Design:** More actively developed in recent years.
*   **Parallel Test Execution:** Faster test runs.
*   **Async Support:** Excellent asynchronous test support for Blazor's async lifecycle.

### Example illustrating test isolation (xUnit+bUnit)

```csharp
public class CounterComponentTests : TestContext
{
    [Fact]
    public void Increment_ShouldIncreaseCountByOne()
    {
        var cut = RenderComponent<Counter>();
        cut.Find("button").Click();
        cut.Find("p").MarkupMatches("<p>Current count: 1</p>");
    }

    [Fact]
    public void IncrementTwice_ShouldIncreaseCountByTwo()
    {
        var cut = RenderComponent<Counter>();
        cut.Find("button").Click();
        cut.Find("button").Click();
        cut.Find("p").MarkupMatches("<p>Current count: 2</p>");
    }
}
```

Each test gets its *own* instance of the `Counter` component. The first test doesn't affect the second test.

### Summary

While nUnit is capable, **xUnit's focus on test isolation, simplicity, and extensibility makes it a better fit** for modern .NET development and particularly well-suited for unit testing Blazor components.
.


## bUnit

Blazor components need a testing tool that speaks their language, and that's where bUnit shines. It creates a simulated browser-like environment, letting us test how our components behave without actually firing up a real browser.

With bUnit, we can check component logic, rendering, and behavior quickly and efficiently. It’s great for running tests in isolation without external dependencies slowing things down. Plus, mocking JavaScript interop calls with `IJSRuntime` is a piece of cake.

But bUnit isn’t perfect. It doesn’t fully support CSS, so visual styling tests might not always behave as expected. Also, since it’s not a real browser, JavaScript execution is limited, which can sometimes be a challenge.

> **Note:** 

## bUnit: Understanding Its Limitations for Effective Blazor Component Testing

bUnit is a powerful tool for unit testing Blazor components, offering a fast and efficient way to verify their logic and rendering behavior. However, it's crucial to understand that bUnit operates within a simulated browser environment, not a full-fledged browser. This design choice, while contributing to its speed and resource efficiency, also introduces certain limitations. This article outlines these limitations and provides guidance, along with concrete examples, on how to navigate them effectively.

### The Core Principle: Simulated, Not Emulated

bUnit's core strength lies in its lightweight rendering engine, which creates an in-memory representation of the Document Object Model (DOM). This allows components to render their HTML structure, which bUnit then uses to verify the output. However, it's crucial to understand that this is a *simulation*, not a full emulation of a browser. This fundamental difference leads to the limitations outlined below.

### CSS Interpretation Challenges and Examples

bUnit's rendering engine understands basic HTML structure and some simple CSS styling (like inline styles), but it **does not fully implement the CSSOM (CSS Object Model) or the layout engine of a real browser**. This means:

-   **External Stylesheets Limitations:** While you *can* include `<link>` tags to external CSS files, bUnit won't fully parse and apply all CSS rules from those files. Simple selectors and inline styles might work, but complex layouts, media queries, and advanced CSS features are unlikely to be rendered correctly.
 ```razor
 // MyComponent.razor
 <div style="background-color: red;">
      <p class="my-text">Hello</p>
 </div>
 ```
 ```css
    /* styles.css */
    .my-text {
        color: blue;
        font-size: 20px;
    }
 ```

 In bUnit, the `background-color: red;` (inline style) would likely be reflected in the rendered output, but the `.my-text` styles (from the external CSS) might not be applied correctly. You would need a full browser test to verify the text is actually blue and 20px in size.
*   **CSS-in-JS Limitations:** Libraries that generate CSS at runtime (like JSS or styled-components) will not function as expected because there's no real CSS engine to interpret the generated styles.
*   **Complex Layouts Not Supported:** Layouts relying on flexbox, grid, or advanced positioning techniques will not be rendered accurately. bUnit primarily focuses on the component's output structure, not its visual layout.
*   **Icon Font Issues:** Icon fonts, often used in UI frameworks like Bootstrap or Font Awesome, won't render correctly. bUnit does not load and render the fonts or the CSS needed to apply them, so instead of icons you'll usually see placeholder characters, empty spaces, or nothing. Similarly, SVG icons used as background images will also not render.

 ```razor
 // MyComponentWithIcons.razor
 <span class="bi bi-check"></span> <!-- Bootstrap Icon -->
 ```

 In bUnit, the Bootstrap Icon would not be rendered correctly. You would not see the check mark.

### JavaScript Execution Constraints and Examples

bUnit **does not execute JavaScript code within a real browser environment**. This has several implications:

-   **JavaScript Interop Testing (Partial):** While you *can* test JavaScript interop by mocking `IJSRuntime`, you are only verifying that the interop calls are made with the correct parameters. You are *not* testing the actual JavaScript code being executed in the browser.

 ```csharp
 // MyComponentWithJSInterop.razor.cs
 public async Task CallAlert()
 {
     await JSRuntime.InvokeVoidAsync("alert", "Hello from JS!");
 }
 ```

 In a bUnit test you could mock the `IJSRuntime`:

 ```csharp
 // MyComponentWithJSInteropTest.cs
 var jsRuntimeMock = new Mock<IJSRuntime>();
 var ctx = new Bunit.TestContext();
 ctx.Services.AddSingleton(jsRuntimeMock.Object);
 var cut = ctx.RenderComponent<MyComponentWithJSInterop>();
 await cut.Instance.CallAlert();
 jsRuntimeMock.Verify(x => x.InvokeVoidAsync("alert", "Hello from JS!"), Times.Once);
 ```

 This verifies that `InvokeVoidAsync` was called with the correct parameters, but it doesn't test the actual `alert()` function of the browser.

-   **JavaScript Library Issues:** Client-side JavaScript libraries (like jQuery, React, or Vue) that manipulate the DOM or handle complex UI interactions will not function within bUnit.
-   **Event Handling Limitations (with JS):** If you have event handlers that rely on JavaScript for their logic (e.g., using `onclick` with inline JavaScript), those event handlers will be ignored. bUnit can trigger events on elements, but the associated JavaScript code will not be executed.

 ```razor
 // MyComponentWithInlineJS.razor
 <button onclick="alert('Button Clicked')">Click Me</button>
 ```

 Clicking the button in a bUnit test won't trigger the `alert()` in the way it would in a real browser.

### Incomplete Browser API Support

bUnit doesn't support all the capabilities of a modern browser, including:

-   **Geolocation and Sensor APIs:** Components relying on these will need manual mocking.
-   **Local/Session Storage:** While mock implementations are available, the behavior may not mirror actual browser storage precisely.
-   **Clipboard Access:** Components that require clipboard access cannot be directly tested in bUnit.
-   **Other Native Features:** Interactions dependent on browser permissions and native APIs cannot be tested directly.

### bUnit Limitations Summary

While bUnit is an excellent tool for unit testing Blazor components, it's important to understand its limitations to avoid frustration and select the right tool for the job. bUnit specializes in rendering components and testing their logic in an isolated environment, but it doesn't fully replicate a real browser's behavior. This means some scenarios might require additional tools or workarounds.

-   **No Full Browser Simulation:** bUnit does not run in an actual browser, which means it lacks support for:
    *   **CSS Styling Validation:** Since bUnit doesn't process CSS in the same way as a real browser, visual aspects of components - such as layout adjustments, animations, and media queries - cannot be tested accurately.
    *   **Exact Layout Testing:** The precise layout and positioning of elements should not be tested with bUnit, as it does not render components with the same fidelity as a real browser.
    *   **Pixel-Perfect Rendering:** Elements may not appear exactly as they would in a real browser, making it unsuitable for UI/UX validation.
    *   **DOM Manipulation Limitations:** While it provides a simulated DOM, advanced CSS selectors and computed styles won't behave the same as they would in a live browser environment.
-   **Limited JavaScript Execution:** Blazor components often rely on JavaScript interop for specific functionality, but bUnit does not execute JavaScript in a real browser context. Instead, it allows mocking via dependency injection, which means:
    *   **No Actual JS Execution:** JavaScript calls are intercepted and replaced with mocks, so the real behavior of scripts cannot be verified.
    *   **External Library Limitations:** Third-party JavaScript libraries (such as charting libraries or interactive elements) cannot be fully tested.
    *   **Event Handling Restrictions:** Complex JavaScript event interactions might not work as expected without manual mocking.
-  **Incomplete Browser API Support:**
    *   **Geolocation and Sensors:** Components that rely on these will need to be mocked manually.
    *   **Local Storage and Session Storage:** While mock implementations exist, actual browser behavior might differ.
    *   **Clipboard Access and Other Native Features:** Some interactions dependent on browser permissions and native APIs cannot be tested directly.
-   **Dependency on Blazor Lifecycle:** bUnit provides hooks for testing Blazor's component lifecycle, but certain lifecycle nuances may not behave exactly as they do in production environments, including:
    *   **Asynchronous Operations Timing:** Delays and async method execution might not perfectly mirror real-world scenarios.
    *   **Render Timing Differences:** Components might render faster or slower compared to production, leading to subtle timing-related issues.
-   **Not Suitable for End-to-End Testing:** bUnit focuses solely on unit testing individual components in isolation. If your goal is to test the entire application flow, you'll need end-to-end testing tools like:
    *   **Selenium, Playwright, or Cypress:** These tools simulate real user interactions and handle full application behavior across multiple components and pages.
    *   **Performance and Load Testing:** bUnit does not measure how well a component performs under heavy usage or stress.

### Why These Limitations Exist: Unit Testing Focus

The limitations stem from bUnit's primary purpose: unit testing Blazor components. The goal is to isolate the component's logic and rendering behavior from the complexities and overhead of a full browser environment. Running a full browser instance for each unit test would be slow and resource-intensive, defeating the purpose of unit testing.

### Best Practices, Workarounds, and Examples

Here's how to effectively work with bUnit's limitations, along with more examples:

1.  **Focus on Component Logic:** Use bUnit to test the component's C# logic, rendering of HTML structure, handling of events within the component's C# code, and interactions with other Blazor components.
2.  **Mock JavaScript Interop:** Mock `IJSRuntime` to verify that JavaScript functions are being called correctly and with the correct parameters, as shown in the example above.
3.  **Use Simplified CSS for Tests:** If minimal CSS styling is needed, use inline styles or a very basic CSS file. Avoid complex CSS features or relying on external stylesheets. For advanced CSS rendering, testing outside bUnit is necessary.
4.  **Mock Icon Components:** If using a component to wrap icons, mock the component, focusing on verifying the presence of the corresponding HTML elements.

 ```csharp
 // Mocking the Icon component
 var mockIcon = new Mock<Icon>();
 mockIcon.Setup(i => i.Render()).Returns(builder => builder.AddContent(0, "[Icon: Check]"));
 ctx.ComponentFactories.AddStub<Icon>(mockIcon.Object);

 var cut = ctx.RenderComponent<MyComponentUsingIcon>();
 cut.MarkupMatches("<p>[Icon: Check]</p>");
 ```

5.  **Placeholder for Test Icons:** You can use a placeholder in the component when testing as shown before.
6.  **Integration/End-to-End Tests for Full Rendering:** For testing the complete rendering, visual layout, and actual JavaScript execution, use integration/end-to-end testing tools like Selenium, Playwright, or Cypress. These tools run in a real browser and can accurately test the full UI.
7.  **CSS Visual Testing:** Use CSS testing tools or visual regression testing for verifying styles, especially when using a component library.
8.  **Component Interaction Testing:** Leverage bUnit methods like `ClickAsync`, `InputAsync`, `FocusAsync`, and `BlurAsync` to simulate user interactions and test the resulting component behavior.
9.  **Dependency Injection for Test Flexibility:** Utilize bUnit's support for mocking dependencies and services to test isolated components.
10. **Test Lifecycle Events:** bUnit provides mechanisms to trigger and test Blazor component lifecycle events, which can help identify issues specific to the lifecycle.
11. **When to Use Workarounds or Alternatives**
    * If your tests require any of the following, consider supplementing bUnit with other tools:
        * **UI/UX Validation:** Use screenshot-based testing tools or manual visual testing.
        * **Comprehensive JavaScript Testing:** Leverage testing frameworks like Jest or Mocha.
        * **Full Browser Testing:** Playwright or Selenium can provide real browser execution.

### In Summary: Know Your Tool's Strengths and Limitations

bUnit is a powerful and efficient unit testing tool for Blazor components, ideal for verifying the logic, structure, and core interactions. However, its limitations regarding CSS and JavaScript execution, as well as incomplete API support, should be well understood. By focusing on what bUnit does well and supplementing it with other testing tools when necessary, you can achieve comprehensive and robust testing for your Blazor applications. Always remember, bUnit is designed for unit testing components; for full visual and user interaction testing, you need to leverage browser-based testing.
  

How does bUnit compare to other tools? Well, if you need fast, focused unit tests, bUnit is your best bet. If you’re looking to test the entire application flow, tools like Selenium, Playwright, or Cypress might be better suited—but they come with more overhead and slower execution.

In short, bUnit is perfect for testing individual components in isolation, while Selenium and similar tools are better for full end-to-end testing when you need a complete browser experience.

# Core bUnit Concepts and Setup

## Setting Up the Test Context

Before writing tests, the first step is to initialize a `TestContext`. Think of it as your testing hub—it sets up everything you need to render, find, and interact with Blazor components. Here's how to get started:

```csharp
using Bunit;
using Xunit;

public class MyComponentTest
{
    [Fact]
    public void MyTest()
    {
       using var ctx = new TestContext();
        // Test will be written here
    }
}
```
`TestContext` provides access to various services required to test components without needing any external dependencies.


## Component Rendering Approaches

Once you've got your `TestContext` set up, you can render components in different ways depending on what you need to test.

- **Basic Component Rendering:**  `RenderComponent<T>()`: This is a straightforward way to render a component of type `T` . For instance:

    ```csharp
    [Fact]
    public void MyComponent_Render()
    {
        // Arrange
        using var ctx = new TestContext();

        // Act
        var cut = ctx.RenderComponent<MyComponent>();

        // Assert
        Assert.NotNull(cut);
    }
    ```
    This method returns `IRenderedComponent<T>`, which lets you interact with the component in your tests.

- **Rendering with Parameters:**  `RenderComponent(ComponentParameter[] parameters)`: This is handy if you need to pass parameters to the component during rendering. Consider you have `MyComponent` which accepts a parameter `Title`:

    ```csharp
    [Fact]
    public void MyComponent_RenderWithTitle()
    {
        // Arrange
        using var ctx = new TestContext();

        // Act
        var cut = ctx.RenderComponent<MyComponent>(
            ComponentParameter.CreateParameter(nameof(MyComponent.Title), "Hello bUnit!"));

        // Assert
        Assert.NotNull(cut);
        Assert.Equal("Hello bUnit!", cut.Instance.Title);
    }
    ```
    `ComponentParameter` lets you supply properties in a type-safe manner.

-   **Rendering with Markup:** Sometimes you'll need to render components within some additional markup. For this, bUnit provides the `Render` method. It lets you pass arbitrary Razor markup.

    ```csharp
    private RenderFragment ConvertToFragment(string html) => builder =>
    {
        builder.AddMarkupContent(0, html);
    };
    
    [Fact]
    public void MyComponent_RenderInMarkup()
    {
    // Arrange
    using var ctx = new TestContext();

    // Act
    var htmlString = """
        <p>
            <MyComponent Title="Hello" />
        </p>
    """;

    var cut = ctx.Render(ConvertToFragment(htmlString));

    // Assert
    var component = cut.FindComponent<MyComponent>();
    Assert.Equal("Hello", component.Instance.Title);
    }
    ```

## Verifying Lifecycle Events

Blazor components go through a lifecycle. bUnit lets you verify lifecycle events are firing correctly using hooks like `OnInitialized`, `OnParametersSet`, and others. You can do this by setting up a fake component. Then you need to inherit your components from it.

```csharp
public class LifecycleComponent : ComponentBase
{
    public bool OnInitializedCalled { get; set; }
    public bool OnParametersSetCalled { get; set; }
    public int ParametersSetCount { get; set; }

    protected override void OnInitialized()
    {
        OnInitializedCalled = true;
    }

    protected override void OnParametersSet()
    {
         ParametersSetCount++;
        OnParametersSetCalled = true;
    }
    [Parameter]
    public int Value {get;set;}
}
```
```csharp
[Fact]
public void LifecycleComponent_LifecycleEvents()
{
    using var ctx = new TestContext();
    var cut = ctx.RenderComponent<LifecycleComponent>();

    Assert.True(cut.Instance.OnInitializedCalled);
    Assert.True(cut.Instance.OnParametersSetCalled);
    Assert.Equal(1, cut.Instance.ParametersSetCount);

    cut.SetParametersAndRender(ComponentParameter.CreateParameter(nameof(LifecycleComponent.Value), 2));
    
    Assert.Equal(2, cut.Instance.ParametersSetCount);

}
```

## Managing Dependencies

Often your components depend on external services. bUnit lets you register these services with the `Services` property of your `TestContext`. This is like dependency injection.
```csharp
public interface IMyService {
    string GetData();
}
public class MyService : IMyService {
    public string GetData() {
        return "Hello from the Service!";
    }
}
public class MyComponentWithService: ComponentBase{
    [Inject]
    public IMyService MyService { get; set; }

    public string ServiceData { get; set; }

    protected override void OnInitialized()
    {
        ServiceData = MyService.GetData();
    }
}
```

```csharp
[Fact]
public void MyComponentWithService_Render_ServiceDataIsSet() {
    using var ctx = new TestContext();
    ctx.Services.AddSingleton<IMyService>(new MyService());
    var cut = ctx.RenderComponent<MyComponentWithService>();

    Assert.Equal("Hello from the Service!", cut.Instance.ServiceData);
}
```

That sounds like a great idea! Extracting the bUnit limitations section into a separate file helps keep the main article concise and makes it easier to update or expand the limitations in the future. It also improves readability for your audience by providing a focused, high-level overview while offering detailed insights for those who need them.  


# Advanced Testing Scenarios using bUnit + FluentAssertions

Now that you're familiar with the core concepts, let's explore more advanced testing techniques using `FluentAssertions` to make assertions clearer and easier to understand.
> **Note**: Starting from version 8, [FluentAssertion](https://xceed.com/products/unit-testing/fluent-assertions) is no longer free of charge for everyone. Use version 7.x instead.

## Testing Component State Changes

Blazor components often have state that updates when users interact with them. `FluentAssertions` provides an intuitive way to verify these state changes.

```csharp
using FluentAssertions;
public class CounterComponent : ComponentBase
{
    public int CurrentCount { get; private set; }

    public void IncrementCount()
    {
        CurrentCount++;
    }
}
```
```csharp
[Fact]
public void CounterComponent_IncrementCount()
{
    // Arrange
    using var ctx = new TestContext();
    var cut = ctx.RenderComponent<CounterComponent>();

    // Act
    cut.Instance.IncrementCount();

    // Assert
    cut.Instance.CurrentCount.Should().Be(1);
}
```

The `Should()` method from `FluentAssertions` makes tests easier to read and provides a natural way to write assertions.

## Verifying Event Handlers and User Interactions

Blazor components often respond to user interactions through event handlers. With bUnit, you can simulate those interactions and check their effects.

```csharp
public class ButtonComponent : ComponentBase
{
    [Parameter]
    public EventCallback OnButtonClicked { get; set; }

    public async Task HandleClick()
    {
        await OnButtonClicked.InvokeAsync();
    }
}

[Fact]
public async Task ButtonComponent_ClickEvent()
{
    // Arrange
    using var ctx = new TestContext();
    bool eventTriggered = false;
    var cut = ctx.RenderComponent<ButtonComponent>(
        ComponentParameter.CreateParameter(
            nameof(ButtonComponent.OnButtonClicked),
            EventCallback.Factory.Create(this, () => eventTriggered = true)));

    // Act
    await cut.Instance.HandleClick();

    // Assert
    eventTriggered.Should().BeTrue();
}
```

## Mocking Dependencies and External Services

Blazor components frequently depend on external services, and bUnit, combined with Moq, allows you to create reliable test environments by simulating those dependencies.

```csharp
public interface IDataService {
    Task<string> GetDataAsync();
}
public class DataComponent : ComponentBase
{
    [Inject]
    public IDataService DataService { get; set; }

    public string Data { get; set; }

    protected override async Task OnInitializedAsync()
    {
        Data = await DataService.GetDataAsync();
    }
}
```

```csharp
using Moq;
...
[Fact]
public async Task DataComponent_DataIsLoadedFromService()
{
    // Arrange
    using var ctx = new TestContext();
    var mockService = new Mock<IDataService>();
    mockService.Setup(s => s.GetDataAsync()).ReturnsAsync("Mocked Data");
    ctx.Services.AddSingleton<IDataService>(mockService.Object);
    var cut = ctx.RenderComponent<DataComponent>();

    // Assert
    cut.Instance.Data.Should().Be("Mocked Data");
}
```

## Testing Component Parameters and Cascading Values

Blazor components often receive parameters and cascading values from parent components. bUnit makes it easy to pass and verify these values.

```csharp
public class ParameterComponent : ComponentBase
{
    [Parameter]
    public string Message { get; set; }
}
```
```csharp
[Fact]
public void ParameterComponent_MessageIsSet()
{
    // Arrange
    using var ctx = new TestContext();
    var cut = ctx.RenderComponent<ParameterComponent>(
        ComponentParameter.CreateParameter(nameof(ParameterComponent.Message), "Hello Parameters"));

    // Assert
    cut.Instance.Message.Should().Be("Hello Parameters");
}
```

For cascading values:

```csharp
@* ParentComponent.razor *@
@using Microsoft.AspNetCore.Components

<CascadingValue Value="@SomeValue">
    @ChildContent
</CascadingValue>

@code {
    [Parameter]
    public RenderFragment ChildContent { get; set; }

    [Parameter]
    public int SomeValue { get; set; } = 123;
}
```
```csharp
// CascadingValueComponent.razor.cs
using Microsoft.AspNetCore.Components;

public class CascadingValueComponent : ComponentBase
{
    [CascadingParameter]
    public int SomeValue { get; set; }
}
```

```csharp
// Test
using Bunit;
using FluentAssertions;
using Xunit;

public class CascadingValueComponentTests
{
    [Fact]
    public void ParentComponent_CascadingValue_ValueIsCascaded()
    {
        // Arrange
        using var ctx = new TestContext();
        var cut = ctx.RenderComponent<ParentComponent>(parameters =>
        {
            parameters.Add(p => p.ChildContent, childComponent =>
            {
                childComponent.AddChildContent<CascadingValueComponent>();
            });
        });
        //Act
        var component = cut.FindComponent<CascadingValueComponent>();
        // Assert
        component.Instance.SomeValue.Should().Be(123);
    }
}
```

## Handling JavaScript Interop

If your Blazor components interact with JavaScript, you can mock `IJSRuntime` calls using bUnit.

```csharp
using Microsoft.JSInterop;
public class JsComponent : ComponentBase
{
    [Inject]
    public IJSRuntime Js { get; set; }

    public string Result { get; set; }

    public async Task GetJsValue()
    {
        Result = await Js.InvokeAsync<string>("someJsFunction");
    }
}
```

```csharp
[Fact]
public async Task JsComponent_InvokeJs()
{
    // Arrange
    using var ctx = new TestContext();
    var mockJsRuntime = new Mock<IJSRuntime>();
    mockJsRuntime.Setup(x => x.InvokeAsync<string>("someJsFunction", It.IsAny<object[]>()))
      .ReturnsAsync("Hello JS");
    ctx.Services.AddSingleton<IJSRuntime>(mockJsRuntime.Object);
    var cut = ctx.RenderComponent<JsComponent>();

    // Act
    await cut.Instance.GetJsValue();

    // Assert
    cut.Instance.Result.Should().Be("Hello JS");
}
```

By mocking `IJSRuntime`, you can isolate your component logic without requiring actual JavaScript execution.
More bUnit examples can be found [here](https://github.com/AlexNek/TodoAppMaui)

# Best Practices and Patterns  

Now that we've covered the fundamentals, let's dive into some best practices to help keep your test code well-structured, reliable, and efficient.  

## Test Organization and Structure  

A well-structured test suite is just as crucial as clean application code. Follow these guidelines to maintain clarity and efficiency:  

- **One test class per component:** Keep tests for each component in a dedicated test file to ensure related tests are grouped logically and easy to find.  
- **Descriptive naming:** Adopt a consistent naming convention such as `[Scenario]_[ExpectedOutcome]` (e.g., `IncrementCount_IncrementsByOne`). If tests span multiple components or need extra context, including the component name like `[Component]_[Scenario]_[ExpectedOutcome]` can enhance clarity, especially in test reports and logs.  
- **Follow the Arrange-Act-Assert (AAA) pattern:** Structure your tests using the AAA approach to improve readability and logical separation of concerns.  
- **Utilize helper methods:** Extract common setup logic into helper functions to reduce code duplication and make tests easier to maintain as the system evolves.  
- **Centralize component creation:** Avoid creating the component under test inline within each test. Instead, use a dedicated factory or helper function to handle instantiation. This approach makes it easier to accommodate changes in component dependencies and configurations across all tests.  

## Common Mistakes and How to Avoid Them  

To make sure your tests stay strong and easy to maintain, watch out for these common mistakes:  

- **Testing too much:** Focus on testing what the component should do, not how the framework works or how things are built inside.  
- **Fragile tests:** Don't check the internal details of the component. Instead, test what the component does by using its public methods and properties.  
- **Forgetting special cases:** Make sure to test unusual situations, errors, and limits to avoid unexpected problems later.  

By avoiding these mistakes, your tests will be more reliable and easier to update in the future.
## Performance Considerations

bUnit tests are typically fast, but it's important to optimize for efficiency:

- **Avoid excessive rendering:** Render only the components and elements required for each test to reduce overhead.
- **Lazy loading:** Consider loading components on demand for complex tests to avoid unnecessary processing.
- **Minimize setup time:** Keep test initialization concise and avoid unnecessary dependencies.

## Integration with CI/CD Pipelines

Automating your tests as part of the development pipeline ensures continuous validation of your components:

- **Test runner integration:** Use popular test runners such as `dotnet test` to execute your xUnit tests.
- **CI/CD compatibility:** Most CI/CD tools (e.g., GitHub Actions, Azure DevOps, Jenkins) can detect and run test projects automatically.
- **Pipeline step:** Add a dedicated step in your CI/CD pipeline to execute the tests, ensuring they run consistently with every build.

```yaml
# Example GitHub Actions workflow
name: .NET CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: 6.x
      - name: Run tests
        run: dotnet test
```

# Wrapping Up: Bringing It All Together

We've explored how to test Blazor components using bUnit, along with helpful tools like `FluentAssertions`. Testing is not a one-time task but an ongoing effort that grows with your application.  

Now, you know how to structure tests, mock dependencies, and handle different scenarios, from basic component rendering to complex interactions.  

## Key Takeaways  

- **Stay Organized:** Use clear naming, follow the AAA pattern, and keep tests focused.  
- **Test Smart:** Focus on behavior rather than implementation details.  
- **Automate:** Add your tests to CI/CD pipelines to catch issues early.  
- **Keep Improving:** Regularly review and refine your testing approach.  

By applying these principles, you'll ensure your Blazor apps remain reliable and maintainable.  

## What's Next?  

Now it’s time to put your knowledge into action. Keep writing tests, catch issues early, and build better Blazor applications.  

Happy testing!

<a href="../de/posts/2025-01-28-blazor-komponententests-mit-bunit.html">Deutsch lesen</a>

<div id="post-nav"></div>
