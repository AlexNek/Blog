---
title: "Blazor-Komponententests mit bUnit"
date: 2025-01-28
categories: [blazor, testing]
tags: [bunit, blazor, testing, xunit, dotnet]
lang: de
excerpt: "Ein praktischer Leitfaden zum Testen von Blazor-Komponenten mit bUnit, xUnit und FluentAssertions."
---
![cover](/images/posts/blazor-testing/cover.png)
## Überblick

Das Testen von Blazor-Komponenten muss nicht kompliziert sein. Mit **bUnit** können Sie die Komponentenlogik, -rendering und -verhalten validieren, ohne sich mit einer vollständigen Browser-Einrichtung auseinanderzusetzen. Dieser Leitfaden beschreibt die Grundlagen für die Verwendung von bUnit zum effizienten und effektiven Testen von Komponenten.

Wir werden untersuchen, wie **bUnit** eingerichtet wird, warum **xUnit** eine gute Wahl für die Durchführung von Tests ist und wie **FluentAssertions** Assertions lesbarer machen kann. Sie erfahren auch, wie Sie Abhängigkeiten simulieren, JavaScript-Interop handhaben und asynchrone Operationen verwalten - und das alles, ohne den Komfort einer simulierten Testumgebung zu verlassen.

Am Ende haben Sie ein klares Verständnis dafür, wie zuverlässige Tests geschrieben werden, Best Practices befolgt werden und wann auf Tools wie Selenium für umfassendere End-to-End-Tests zurückgegriffen werden sollte.

# Warum wir diese Tools gewählt haben

## xUnit

Wenn es um das Testen von Blazor-Komponenten geht, ist xUnit unser bevorzugtes Framework. Es ist modern, unkompliziert und vollgepackt mit nützlichen Funktionen, die das Testen zum Kinderspiel machen. Im Gegensatz zu älteren Frameworks, die schwerfällig wirken können, wurde xUnit mit dem Ziel entwickelt, einfach und flexibel zu sein.

Warum also xUnit? Es hält die Dinge sauber und organisiert, unterstützt asynchrone Tests direkt aus der Box und führt Tests parallel aus, um die Dinge zu beschleunigen. Außerdem arbeitet es nahtlos mit FluentAssertions zusammen, wodurch Ihre Test-Assertions klarer und lesbarer werden.

Andere Optionen wie NUnit und MSTest? Sicher, sie sind schon eine Weile da, aber sie haben ihre eigenen Macken. NUnit hat Probleme mit der effizienten Verwaltung von Testinstanzen, und MSTest bietet einfach nicht die gleiche Flexibilität und Benutzerfreundlichkeit. Letztendlich ist xUnit einfach besser für das moderne Testen von Blazor-Komponenten geeignet.

Für eine detailliertere Aufschlüsselung, warum wir xUnit gegenüber anderen Optionen gewählt haben, siehe umfassender 

## xUnit vs. nUnit: Ein Vergleich für erfahrene Entwickler

xUnit und nUnit sind beliebte und bewährte Testframeworks für .NET. Trotzdem gibt es Unterschiede in ihrer Art und ihren Funktionen. Dieser Vergleich konzentriert sich auf die wichtigsten Punkte für erfahrene Entwickler, besonders wenn es um das Testen von Blazor-Komponenten geht.

### 1. Teststruktur und Attribute

*   **xUnit:** Betont Konventionen über Konfiguration. Verwendet `[Fact]` für einzelne Testmethoden und `[Theory]` für datengesteuerte Tests mit `[InlineData]`, `[MemberData]` oder benutzerdefinierten `DataAttribute`-Implementierungen.
*   **nUnit:** Verwendet `[Test]` für Testmethoden und `[TestCase]` für datengesteuerte Tests. Gruppiert Tests mit `[TestFixture]` und unterstützt `[SetUp]`/`[TearDown]`.

### 2. Testlebenszyklus und Isolation

*   **xUnit:** Erstellt eine neue Instanz der Testklasse für ***jede*** Testmethode. Dies bietet hervorragende Testisolation.
*   **nUnit:** Erstellt standardmäßig eine einzige Instanz der Test-Fixture für alle Tests. Kann zu Problemen mit gemeinsam genutztem Zustand führen.

### 3. Erweiterbarkeit und Anpassung

*   **xUnit:** Wurde so entwickelt, dass es leicht erweitert werden kann. Es nutzt ein Provider-Modell. Bietet auch `ITestOutputHelper` für Testausgaben.
*   **nUnit:** Kann ebenfalls erweitert werden, aber das Provider-Modell von xUnit gilt oft als flexibler.

### 4. Datengesteuerte Tests

*   **xUnit:** Bietet `[Theory]` mit `[InlineData]`, `[MemberData]` — sauber und prägnant.
*   **nUnit:** Verwendet `[TestCase]` — funktional, aber xUnit's Ansatz wird oft als eleganter angesehen.

### 5. Assertions

Beide bieten eingebaute Assertions. Viele Entwickler bevorzugen FluentAssertions wegen ihrer lesbaren Syntax.

### 6. Community und Ökosystem

Beide haben starke Communities. xUnit wird oft als moderner angesehen. Es ist das Standard-Testframework für ASP.NET Core-Projekte.

### Warum xUnit oft für Blazor-Komponententests bevorzugorzugt wird

*   **Testisolation:** Die Erstellung von Instanzen pro Testmethode verhindert Zustandslecks.
*   **Einfachheit und Fokus:** Konventionsbasierter Ansatz für fokussierte Unit-Tests.
*   **Erweiterbarkeit:** Provider-Modell für einfache Integration mit Blazor-Testbibliotheken.
*   **Testausgabe:** `ITestOutputHelper` für die Testausgabe.
*   **Modernes Design:** Aktiver entwickelt in den letzten Jahren.
*   **Parallele Testausführung:** Schnellere Testläufe.
*   **Async-Unterstützung:** Hervorragende Unterstützung für asynchrone Tests.

### Wie Tests mit xUnit und bUnit unabhängig voneinander ausgeführt werden können

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

Jeder Test erhält seine *eigene* Instanz der `Counter`-Komponente. Der erste Test beeinflusst den zweiten Test in keiner Weise.

### Zusammenfassung

nUnit ist ein starkes Testframework, aber **xUnit ist oft die bessere Wahl für moderne .NET-Projekte**, besonders für das Testen von Blazor-Komponenten. xUnit legt großen Wert auf Testisolation, Einfachheit und Erweiterbarkeit.
.

## bUnit

Blazor-Komponenten benötigen ein Testtool, das ihre Sprache spricht, und hier glänzt bUnit. Es erstellt eine simulierte browserähnliche Umgebung, die es uns ermöglicht, zu testen, wie sich unsere Komponenten verhalten, ohne tatsächlich einen echten Browser zu starten.

Mit bUnit können wir die Komponentenlogik, das Rendering und das Verhalten schnell und effizient überprüfen.Es eignet sich hervorragend, um isoliert zu testen, ohne dass externe Abhängigkeiten die Arbeit verlangsamen. Außerdem ist das Mocken von JavaScript-Interop-Aufrufen mit `IJSRuntime` ein Kinderspiel.

Aber bUnit ist nicht perfekt. Es unterstützt CSS nicht vollständig, sodass visuelle Styling-Tests möglicherweise nicht immer wie erwartet funktionieren. Da es auch kein echter Browser ist, ist die JavaScript-Ausführung eingeschränkt, was manchmal eine Herausforderung sein kann.

> **Hinweis:** Um mehr über die Einschränkungen von bUnit zu erfahren, lesen Sie bitte 

# bUnit: Verständnis der Einschränkungen für effektives Blazor-Komponententesten

bUnit ist ein leistungsstarkes Tool für das Unit-Testing von Blazor-Komponenten und bietet eine schnelle und effiziente Möglichkeit, deren Logik und Rendering-Verhalten zu überprüfen. Es ist jedoch entscheidend zu verstehen, dass bUnit in einer simulierten Browserumgebung und nicht in einem vollwertigen Browser arbeitet. Diese Designentscheidung, die zu seiner Geschwindigkeit und Ressourceneffizienz beiträgt, führt auch zu bestimmten Einschränkungen. Dieser Artikel beschreibt diese Einschränkungen und bietet Anleitungen sowie konkrete Beispiele, wie man sie effektiv navigieren kann.

### Das Kernprinzip: Simuliert, nicht emuliert

Die Stärke von bUnit liegt in seiner leichtgewichtigen Rendering-Engine, die eine speicherinterne Darstellung des Document Object Model (DOM) erstellt. Dies ermöglicht es den Komponenten, ihre HTML-Struktur zu rendern, die bUnit dann verwendet, um die Ausgabe zu überprüfen. Es ist jedoch wichtig zu verstehen, dass dies eine *Simulation* und keine vollständige Emulation eines Browsers ist. Dieser grundlegende Unterschied führt zu den nachstehend beschriebenen Einschränkungen.

### Herausforderungen und Beispiele bei der CSS-Interpretation

Die Rendering-Engine von bUnit versteht die grundlegende HTML-Struktur und einige einfache CSS-Stile (wie Inline-Stile), implementiert jedoch nicht vollständig das CSSOM (CSS Object Model) oder die Layout-Engine eines echten Browsers. Das bedeutet:

-   **Einschränkungen bei externen Stylesheets:** Obwohl Sie `<link>`-Tags zu externen CSS-Dateien hinzufügen *können*, wird bUnit nicht alle CSS-Regeln aus diesen Dateien vollständig parsen und anwenden. Einfache Selektoren und Inline-Stile funktionieren möglicherweise, aber komplexe Layouts, Medienabfragen und fortgeschrittene CSS-Funktionen werden wahrscheinlich nicht korrekt gerendert.
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

 In bUnit würde die `background-color: red;` (Inline-Style) wahrscheinlich in der gerenderten Ausgabe reflektiert, aber die `.my-text`-Stile (aus dem externen CSS) würden möglicherweise nicht korrekt angewendet. Sie benötigen einen vollständigen Browser-Test, um zu überprüfen, ob der Text tatsächlich blau und 20 px groß ist.
*   **Einschränkungen bei CSS-in-JS:** Bibliotheken, die CSS zur Laufzeit generieren (wie JSS oder styled-components), funktionieren nicht wie erwartet, da keine echte CSS-Engine vorhanden ist, um die generierten Stile zu interpretieren.
*   **Keine Unterstützung für komplexe Layouts:** Layouts, die auf Flexbox, Grid oder fortschrittlichen Positionierungstechniken basieren, werden nicht genau gerendert. bUnit konzentriert sich hauptsächlich auf die Ausgabestruktur der Komponente, nicht auf ihr visuelles Layout.
*   **Probleme mit Icon-Fonts:** Icon-Fonts, die häufig in UI-Frameworks wie Bootstrap oder Font Awesome verwendet werden, werden nicht korrekt gerendert. bUnit lädt und rendert die Schriftarten oder das CSS nicht, das benötigt wird, um sie anzuwenden, sodass Sie anstelle von Icons normalerweise Platzhalterzeichen, Leerzeichen oder nichts sehen. Ebenso werden SVG-Icons, die als Hintergrundbilder verwendet werden, ebenfalls nicht gerendert.

 ```razor
 // MyComponentWithIcons.razor
 <span class="bi bi-check"></span> <!-- Bootstrap Icon -->
 ```

 In bUnit würde das Bootstrap-Icon nicht korrekt gerendert. Sie würden das Häkchen nicht sehen.

### Einschränkungen und Beispiele bei der JavaScript-Ausführung

bUnit **führt JavaScript-Code nicht in einer echten Browserumgebung aus**. Dies hat mehrere Implikationen:

-   **JavaScript-Interop-Tests (teilweise):** Obwohl Sie JavaScript-Interop testen können, indem Sie `IJSRuntime` mocken, überprüfen Sie nur, dass die Interop-Aufrufe mit den richtigen Parametern durchgeführt werden. Sie testen *nicht* den tatsächlichen JavaScript-Code, der im Browser ausgeführt wird.

 ```csharp
 // MyComponentWithJSInterop.razor.cs
 public async Task CallAlert()
 {
     await JSRuntime.InvokeVoidAsync("alert", "Hello from JS!");
 }
 ```

 In einem bUnit-Test könnten Sie `IJSRuntime` mocken:

 ```csharp
 // MyComponentWithJSInteropTest.cs
 var jsRuntimeMock = new Mock<IJSRuntime>();
 var ctx = new Bunit.TestContext();
 ctx.Services.AddSingleton(jsRuntimeMock.Object);
 var cut = ctx.RenderComponent<MyComponentWithJSInterop>();
 await cut.Instance.CallAlert();
 jsRuntimeMock.Verify(x => x.InvokeVoidAsync("alert", "Hello from JS!"), Times.Once);
 ```

 Dies überprüft, dass `InvokeVoidAsync` mit den richtigen Parametern aufgerufen wurde, testet jedoch nicht die tatsächliche `alert()`-Funktion des Browsers.

-   **Probleme mit JavaScript-Bibliotheken:** Clientseitige JavaScript-Bibliotheken (wie jQuery, React oder Vue), die das DOM manipulieren oder komplexe UI-Interaktionen handhaben, funktionieren nicht innerhalb von bUnit.
-   **Einschränkungen bei der Ereignisbehandlung (mit JS):** Wenn Sie Ereignishandler haben, die für ihre Logik auf JavaScript angewiesen sind (z. B. `onclick` mit Inline-JavaScript), werden diese Ereignishandler ignoriert. bUnit kann Ereignisse auf Elementen auslösen, aber der zugehörige JavaScript-Code wird nicht ausgeführt.

 ```razor
 // MyComponentWithInlineJS.razor
 <button onclick="alert('Button Clicked')">Click Me</button>
 ```

 Das Klicken auf die Schaltfläche in einem bUnit-Test löst die `alert()`-Funktion nicht so aus, wie es in einem echten Browser der Fall wäre.

### Unvollständige Unterstützung der Browser-API

bUnit unterstützt nicht alle Fähigkeiten eines modernen Browsers, einschließlich:

-   **Geolocation und Sensor-APIs:** Komponenten, die darauf angewiesen sind, benötigen manuelles Mocking.
-   **Lokaler/Sitzungsspeicher:** Obwohl Mock-Implementierungen verfügbar sind, spiegelt das Verhalten möglicherweise nicht genau den tatsächlichen Browserspeicher wider.
-   **Zwischenablagezugriff:** Komponenten, die Zwischenablagezugriff erfordern, können nicht direkt in bUnit getestet werden.
-   **Andere native Funktionen:** Interaktionen, die von Browserberechtigungen und nativen APIs abhängen, können nicht direkt getestet werden.

### Zusammenfassung der bUnit-Einschränkungen

Obwohl bUnit ein hervorragendes Tool für das Unit-Testing von Blazor-Komponenten ist, ist es wichtig, seine Einschränkungen zu verstehen, um Frustrationen zu vermeiden und das richtige Werkzeug für die Aufgabe auszuwählen. bUnit spezialisiert sich auf das Rendern von Komponenten und das Testen ihrer Logik in einer isolierten Umgebung, repliziert jedoch nicht vollständig das Verhalten eines echten Browsers. Dies bedeutet, dass einige Szenarien möglicherweise zusätzliche Tools oder Workarounds erfordern.

-   **Keine vollständige Browser-Simulation:** bUnit läuft nicht in einem echten Browser, was bedeutet, dass es keine Unterstützung bietet für:
    *   **CSS-Styling-Validierung:** Da bUnit CSS nicht auf die gleiche Weise wie ein echter Browser verarbeitet, können visuelle Aspekte von Komponenten – wie Layoutanpassungen, Animationen und Medienabfragen – nicht genau getestet werden.
    *   **Genaues Layout-Testen:** Das genaue Layout und die Positionierung von Elementen sollten nicht mit bUnit getestet werden, da es Komponenten nicht mit der gleichen Genauigkeit wie ein echter Browser rendert.
    *   **Pixelgenaues Rendering:** Elemente erscheinen möglicherweise nicht genau so, wie sie in einem echten Browser erscheinen würden, was es für die UI/UX-Validierung ungeeignet macht.
    *   **DOM-Manipulationseinschränkungen:** Obwohl es ein simuliertes DOM bereitstellt, verhalten sich fortgeschrittene CSS-Selektoren und berechnete Stile nicht so wie in einer Live-Browserumgebung.
-   **Eingeschränkte JavaScript-Ausführung:** Blazor-Komponenten sind oft auf JavaScript-Interop für bestimmte Funktionen angewiesen, aber bUnit führt JavaScript nicht in einem echten Browserkontext aus. Stattdessen ermöglicht es das Mocking über Dependency Injection, was bedeutet:
    *   **Keine tatsächliche JS-Ausführung:** JavaScript-Aufrufe werden abgefangen und durch Mocks ersetzt, sodass das tatsächliche Verhalten von Skripten nicht überprüft werden kann.
    *   **Einschränkungen bei externen Bibliotheken:** JavaScript-Bibliotheken von Drittanbietern (wie Diagrammbibliotheken oder interaktive Elemente) können nicht vollständig getestet werden.
    *   **Ereignisbehandlungsbeschränkungen:** Komplexe JavaScript-Ereignisinteraktionen funktionieren möglicherweise nicht wie erwartet ohne manuelles Mocking.
-  **Unvollständige Unterstützung der Browser-API:**
    *   **Geolocation und Sensoren:** Komponenten, die darauf angewiesen sind, müssen manuell gemockt werden.
    *   **Lokaler Speicher und Sitzungsspeicher:** Obwohl Mock-Implementierungen existieren, kann sich das tatsächliche Browserverhalten unterscheiden.
    *   **Zwischenablagezugriff und andere native Funktionen:** Einige Interaktionen, die von Browserberechtigungen und nativen APIs abhängen, können nicht direkt getestet werden.
-   **Abhängigkeit vom Blazor-Lebenszyklus:** bUnit bietet Hooks zum Testen des Blazor-Komponentenlebenszyklus, aber bestimmte Lebenszyklus-Feinheiten verhalten sich möglicherweise nicht genau so wie in Produktionsumgebungen, einschließlich:
    *   **Timing asynchroner Operationen:** Verzögerungen und die Ausführung asynchroner Methoden spiegeln möglicherweise nicht perfekt reale Szenarien wider.
    *   **Render-Timing-Unterschiede:** Komponenten rendern möglicherweise schneller oder langsamer als in der Produktion, was zu subtilen zeitbezogenen Problemen führt.
-   **Nicht geeignet für End-to-End-Tests:** bUnit konzentriert sich ausschließlich auf das Unit-Testing einzelner Komponenten in Isolation. Wenn Ihr Ziel darin besteht, den gesamten Anwendungsablauf zu testen, benötigen Sie End-to-End-Testtools wie:
    *   **Selenium, Playwright oder Cypress:** Diese Tools simulieren echte Benutzerinteraktionen und handhaben das vollständige Anwendungsverhalten über mehrere Komponenten und Seiten hinweg.
    *   **Leistungs- und Lasttests:** bUnit misst nicht, wie gut eine Komponente unter hoher Auslastung oder Stress funktioniert.

### Warum diese Einschränkungen existieren: Fokus auf Unit-Tests

Die Einschränkungen ergeben sich aus dem primären Zweck von bUnit: dem Unit-Testing von Blazor-Komponenten. Das Ziel ist es, die Logik und das Rendering-Verhalten der Komponente von den Komplexitäten und dem Overhead einer vollständigen Browserumgebung zu isolieren. Das Ausführen einer vollständigen Browserinstanz für jeden Unit-Test wäre langsam und ressourcenintensiv und würde den Zweck des Unit-Testings zunichtemachen.

### Best Practices, Workarounds und Beispiele

Hier erfahren Sie, wie Sie effektiv mit den Einschränkungen von bUnit arbeiten, zusammen mit weiteren Beispielen:

1.  **Konzentrieren Sie sich auf die Komponentenlogik:** Verwenden Sie bUnit, um die C#-Logik der Komponente, das Rendern der HTML-Struktur, die Behandlung von Ereignissen innerhalb des C#-Codes der Komponente und die Interaktionen mit anderen Blazor-Komponenten zu testen.
2.  **Mocken Sie JavaScript-Interop:** Mocken Sie `IJSRuntime`, um zu überprüfen, ob JavaScript-Funktionen korrekt und mit den richtigen Parametern aufgerufen werden, wie im obigen Beispiel gezeigt.
3.  **Verwenden Sie vereinfachtes CSS für Tests:** Wenn minimales CSS-Styling erforderlich ist, verwenden Sie Inline-Stile oder eine sehr einfache CSS-Datei. Vermeiden Sie komplexe CSS-Funktionen oder die Verwendung externer Stylesheets. Für fortgeschrittene CSS-Rendering ist ein Test außerhalb von bUnit erforderlich.
4.  **Mocken Sie Icon-Komponenten:** Wenn Sie eine Komponente verwenden, um Icons zu umschließen, mocken Sie die Komponente und konzentrieren Sie sich auf die Überprüfung der Anwesenheit der entsprechenden HTML-Elemente.

 ```csharp
 // Mocking the Icon component
 var mockIcon = new Mock<Icon>();
 mockIcon.Setup(i => i.Render()).Returns(builder => builder.AddContent(0, "[Icon: Check]"));
 ctx.ComponentFactories.AddStub<Icon>(mockIcon.Object);

 var cut = ctx.RenderComponent<MyComponentUsingIcon>();
 cut.MarkupMatches("<p>[Icon: Check]</p>");
 ```

5.  **Platzhalter für Test-Icons:** Sie können einen Platzhalter in der Komponente verwenden, wenn Sie wie zuvor getestet haben.
6.  **Integrations-/End-to-End-Tests für vollständiges Rendering:** Verwenden Sie für das Testen des vollständigen Renderings, des visuellen Layouts und der tatsächlichen JavaScript-Ausführung Integrations-/End-to-End-Testtools wie Selenium, Playwright oder Cypress. Diese Tools laufen in einem echten Browser und können die vollständige UI genau testen.
7.  **CSS-Visual-Testing:** Verwenden Sie CSS-Testtools oder visuelle Regressionstests zur Überprüfung von Stilen, insbesondere beim Verwenden einer Komponentenbibliothek.
8.  **Komponenteninteraktionstests:** Nutzen Sie bUnit-Methoden wie `ClickAsync`, `InputAsync`, `FocusAsync` und `BlurAsync`, um Benutzerinteraktionen zu simulieren und das resultierende Komponentenverhalten zu testen.
9.  **Dependency Injection für Testflexibilität:** Nutzen Sie die Unterstützung von bUnit für das Mocken von Abhängigkeiten und Diensten, um isolierte Komponenten zu testen.
10. **Testen von Lebenszyklusereignissen:** bUnit bietet Mechanismen zum Auslösen und Testen von Blazor-Komponentenlebenszyklusereignissen, die helfen können, lebenszyklusspezifische Probleme zu identifizieren.
11. **Wann Workarounds oder Alternativen verwenden**
    * Wenn Ihre Tests eines der folgenden erfordern, sollten Sie bUnit durch andere Tools ergänzen:
        * **UI/UX-Validierung:** Verwenden Sie screenshotbasierte Testtools oder manuelle visuelle Tests.
        * **Umfangreiche JavaScript-Tests:** Nutzen Sie Testframeworks wie Jest oder Mocha.
        * **Vollständiges Browser-Testing:** Playwright oder Selenium können eine echte Browserausführung bieten.

### Zusammenfassung: Kenne die Stärken und Schwächen deines Tools

bUnit ist ein leistungsstarkes und effizientes Unit-Test-Tool für Blazor-Komponenten, ideal zum Überprüfen der Logik, Struktur und Kerninteraktionen. Seine Einschränkungen in Bezug auf CSS und JavaScript-Ausführung sowie die unvollständige API-Unterstützung sollten jedoch gut verstanden werden. Durch Konzentration auf das, was bUnit gut kann, und Ergänzung durch andere Testtools bei Bedarf können Sie umfassende und robuste Tests für Ihre Blazor-Anwendungen erreichen. Denken Sie immer daran, bUnit ist für das Unit-Testing von Komponenten konzipiert; für vollständige visuelle und Benutzerinteraktionstests müssen Sie browserbasierte Tests nutzen.


Wie schneidet bUnit im Vergleich zu anderen Tools ab? Nun, wenn Sie schnelle, fokussierte Unit-Tests benötigen, ist bUnit Ihre beste Wahl. Wenn Sie den gesamten Anwendungsablauf testen möchten, sind Tools wie Selenium, Playwright oder Cypress möglicherweise besser geeignet – aber sie bringen mehr Overhead und langsamere Ausführung mit sich.

Kurz gesagt, bUnit ist perfekt für das Testen einzelner Komponenten in Isolation, während Selenium und ähnliche Tools besser für vollständige End-to-End-Tests geeignet sind, wenn Sie eine vollständige Browser-Erfahrung benötigen.

# Grundlegende bUnit-Konzepte und -Einrichtung

## Einrichten des Testkontexts

Bevor Tests geschrieben werden, besteht der erste Schritt darin, einen `TestContext` zu initialisieren. Betrachten Sie es als Ihren Test-Hub – es richtet alles ein, was Sie benötigen, um Blazor-Komponenten zu rendern, zu finden und damit zu interagieren. So geht's los:

```csharp
using Bunit;
using Xunit;

public class MyComponentTest
{
    [Fact]
    public void MyTest()
    {
       using var ctx = new TestContext();
        // Der Test wird hier geschrieben
    }
}
```
`TestContext` bietet Zugriff auf verschiedene Dienste, die zum Testen von Komponenten benötigt werden, ohne dass externe Abhängigkeiten erforderlich sind.

## Komponenten-Rendering-Ansätze

Sobald Sie Ihren `TestContext` eingerichtet haben, können Sie Komponenten auf verschiedene Weise rendern, je nachdem, was getestet werden muss.

- **Grundlegendes Komponenten-Rendering:** `RenderComponent<T>()`: Dies ist eine unkomplizierte Möglichkeit, eine Komponente vom Typ `T` zu rendern. Zum Beispiel:

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
    Diese Methode gibt `IRenderedComponent<T>` zurück, das Ihnen die Interaktion mit der Komponente in Ihren Tests ermöglicht.

- **Rendering mit Parametern:** `RenderComponent(ComponentParameter[] parameters)`: Dies ist praktisch, wenn Sie beim Rendern Parameter an die Komponente übergeben müssen. Angenommen, Sie haben `MyComponent`, das einen Parameter `Title` akzeptiert:

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
    `ComponentParameter` ermöglicht es Ihnen, Eigenschaften auf typesichere Weise zu liefern.

- **Rendering mit Markup:** Manchmal müssen Sie Komponenten innerhalb zusätzlicher Markups rendern. Für diesen Zweck stellt bUnit die `Render`-Methode bereit. Sie ermöglicht das Übergeben von beliebigem Razor-Markup.

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

## Überprüfen von Lebenszyklusereignissen

Blazor-Komponenten durchlaufen einen Lebenszyklus. Mit bUnit können Sie überprüfen, ob Lebenszyklusereignisse korrekt ausgelöst werden, indem Sie Hooks wie `OnInitialized`, `OnParametersSet` und andere verwenden. Sie können dies erreichen, indem Sie eine Dummy-Komponente erstellen. Dann müssen Sie Ihre Komponenten davon erben lassen.

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

## Verwalten von Abhängigkeiten

Oft hängen Ihre Komponenten von externen Diensten ab. bUnit ermöglicht es Ihnen, diese Dienste mit der `Services`-Eigenschaft Ihres `TestContext` zu registrieren. Dies ist so, als ob man Abhängigkeiten injizieren würde.

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

Das klingt nach einer großartigen Idee! Das Extrahieren des Abschnitts zu den bUnit-Einschränkungen in eine separate Datei hilft, den Hauptartikel prägnant zu halten und erleichtert zukünftige Aktualisierungen oder Erweiterungen der Einschränkungen. Es verbessert auch die Lesbarkeit für Ihr Publikum, indem es eine fokussierte, hochrangige Übersicht bietet und gleichzeitig detaillierte Einblicke für diejenigen bietet, die sie benötigen.

# Erweiterte Testszenarien mit bUnit + FluentAssertions

Nun, da Sie mit den grundlegenden Konzepten vertraut sind, wollen wir fortgeschrittene Testtechniken erkunden und `FluentAssertions` verwenden, um Assertions klarer und verständlicher zu machen.
> **Hinweis:** Ab Version 8 ist [FluentAssertion](https://xceed.com/products/unit-testing/fluent-assertions) nicht mehr für alle kostenlos. Verwenden Sie stattdessen Version 7.x.

## Testen von Komponentenzustandsänderungen

Blazor-Komponenten haben oft einen Zustand, der aktualisiert wird, wenn Benutzer(innen) mit ihnen interagieren. `FluentAssertions` bietet eine intuitive Möglichkeit, diese Zustandsänderungen zu überprüfen.

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

Die `Should()`-Methode von `FluentAssertions` macht Tests einfacher zu lesen und bietet eine natürliche Möglichkeit, Assertions zu schreiben.

## Überprüfen von Ereignishandlern und Benutzerinteraktionen

Blazor-Komponenten reagieren oft über Ereignishandler auf Benutzerinteraktionen. Mit bUnit können Sie diese Interaktionen simulieren und ihre Auswirkungen überprüfen.

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
```
```csharp
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

## Mocken von Abhängigkeiten und externen Diensten

Blazor-Komponenten sind häufig von externen Diensten abhängig, und bUnit in Kombination mit Moq ermöglicht es Ihnen, zuverlässige Testumgebungen zu erstellen, indem Sie diese Abhängigkeiten simulieren.

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

## Testen von Komponentenparametern und kaskadierenden Werten

Blazor-Komponenten erhalten häufig Parameter und kaskadierende Werte von übergeordneten Komponenten. bUnit macht es einfach, diese Werte zu übertragen und zu überprüfen.

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

Für kaskadierende Werte:

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

## Handhabung von JavaScript-Interop

Wenn Ihre Blazor-Komponenten mit JavaScript interagieren, können Sie `IJSRuntime`-Aufrufe mit bUnit mocken.

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

Durch das Mocken von `IJSRuntime` können Sie Ihre Komponentenlogik isolieren, ohne eine tatsächliche JavaScript-Ausführung zu erfordern.
Weitere bUnit-Beispiele finden Sie [hier](https://github.com/AlexNek/TodoAppMaui)

# Best Practices und Muster

Nachdem wir nun die Grundlagen kennen, werden wir einige Best Practices durchgehen, um Ihren Testcode organisiert, zuverlässig und performant zu halten.



## Testorganisation und Struktur  

Eine gut strukturierte Testsuite ist genauso wichtig wie sauberer Anwendungscode. Befolgen Sie diese Richtlinien, um Klarheit und Effizienz zu wahren:

- **Eine Testklasse pro Komponente:** Führen Sie für jede Komponente eine eigene Testdatei und stellen Sie sicher, dass ähnliche Tests zusammengefasst werden.  
- **Aussagekräftige Namensgebung:** Verwende eine konsistente Namenskonvention wie `[Szenario]_[ErwartetesErgebnis]` (z.B. `IncrementCount_IncrementsByOne`). Falls Tests mehrere Komponenten betreffen oder zusätzlicher Kontext erforderlich ist, kann es hilfreich sein, den Komponentennamen einzubeziehen, z.B. `[Komponente]_[Szenario]_[ErwartetesErgebnis]`, insbesondere für Testberichte und Logs.  
- **Das Arrange-Act-Assert (AAA) Muster:** Strukturieren Sie Ihre Tests nach dem AAA-Ansatz, um die Lesbarkeit und die logische Trennung von Themen zu verbessern.
- **Hilfsmethoden:** Extrahieren gemeinsamer Konfigurationslogik in Hilfsfunktionen, um Code-Duplizierung zu reduzieren und das Testen bei der Weiterentwicklung des Systems zu vereinfachen.  
- **Zentrale Erstellung von Komponenten:** Vermeiden Sie es, die zu testende Komponente in jedem Test inline zu erzeugen. Verwenden Sie stattdessen eine spezielle Factory oder eine Hilfsfunktion für die Instanziierung. Dieser Ansatz erleichtert die Berücksichtigung von Änderungen der Komponentenabhängigkeiten und -konfigurationen in allen Tests. 

## Häufige Fehler und wie man sie vermeidet  

Achten Sie auf diese Fehler, damit Ihre Tests zuverlässig und leicht zu pflegen bleiben:  

- **Zu viel testen:** Testen Sie nur, was die Komponente tun soll, und nicht, wie das Framework funktioniert oder wie die Komponente innen aufgebaut ist.  
- **Empfindliche Tests:** Testen Sie nicht die inneren Details der Komponente. Konzentrieren Sie sich stattdessen darauf, ob die öffentlichen Methoden und Eigenschaften das Richtige tun.  
- **Besondere Fälle vergessen:** Denken Sie daran, auch seltene Situationen, Fehlerfälle und Grenzwerte zu testen, damit später keine unerwarteten Probleme auftreten.  

Wenn Sie diese Fehler vermeiden, bleiben Ihre Tests stabil und leicht anpassbar.

## Leistungsüberlegungen

bUnit-Tests sind normalerweise schnell, aber es ist wichtig, sie effizient zu halten:  

- **Zu viel Rendering vermeiden:** Rendern Sie nur die Teile der Komponente, die für den Test wirklich nötig sind, um die Testdauer zu verkürzen.  
- **Komponenten bei Bedarf laden:** Laden Sie nur die notwendigen Teile einer Komponente in komplexen Tests, um unnötige Verarbeitung zu vermeiden.  
- **Einfaches Setup:** Halten Sie die Testvorbereitung so kurz wie möglich und vermeiden Sie unnötige Abhängigkeiten.  

## Integration in CI/CD-Pipelines

Die Automatisierung Ihrer Tests als Teil der Entwicklungspipeline gewährleistet eine kontinuierliche Validierung Ihrer Komponenten:

- **Testrunner-Integration:** Verwenden Sie beliebte Testrunner wie `dotnet test`, um Ihre xUnit-Tests auszuführen.
- **CI/CD-Kompatibilität:** Die meisten CI/CD-Tools (z. B. GitHub Actions, Azure DevOps, Jenkins) können Testprojekte automatisch erkennen und ausführen.
- **Pipelineschritt:** Fügen Sie Ihrer CI/CD-Pipeline einen dedizierten Schritt hinzu, um die Tests auszuführen und sicherzustellen, dass sie konsistent mit jedem Build ausgeführt werden.

```yaml
# Beispiel für GitHub Actions Workflow
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

# Zusammenfassung

Wir haben untersucht, wie Blazor-Komponenten mit bUnit getestet werden, zusammen mit hilfreichen Tools wie `FluentAssertions`. Testen ist keine einmalige Aufgabe, sondern eine kontinuierliche Anstrengung, die mit Ihrer Anwendung wächst.

Jetzt wissen Sie, wie Sie Tests strukturieren, Abhängigkeiten mocken und verschiedene Szenarien handhaben, von einfachem Komponenten-Rendering bis hin zu komplexen Interaktionen.

## Wichtige Erkenntnisse

- **Organisiert bleiben:** Verwenden Sie klare Benennungen, folgen Sie dem AAA-Muster und halten Sie Tests fokussiert.
- **Intelligent testen:** Konzentrieren Sie sich auf das Verhalten anstatt auf Implementierungsdetails.
- **Automatisieren:** Fügen Sie Ihre Tests zu CI/CD-Pipelines hinzu, um Probleme frühzeitig zu erkennen.
- **Weiter verbessern:** Überprüfen und verfeinern Sie Ihren Testansatz regelmäßig.

Durch die Anwendung dieser Prinzipien stellen Sie sicher, dass Ihre Blazor-Apps zuverlässig und wartbar bleiben.

## Was kommt als Nächstes?

Jetzt ist es an der Zeit, Ihr Wissen in die Tat umzusetzen. Schreiben Sie weiter Tests, erkennen Sie Probleme frühzeitig und bauen Sie bessere Blazor-Anwendungen.

Viel Spaß beim Testen!

<a href="../../posts/2025-01-28-blazor-component-testing-bunit.html">Read in English</a>

<div id="post-nav"></div>
