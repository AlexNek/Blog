---
title: "Blazor für Entwickler"
date: 2024-12-13
categories: [blazor, dotnet]
tags: [blazor, rendering, ssr, interaktiv, dotnet]
lang: de
excerpt: "Ein Deep-Dive in Blazors Rendering-Modi: SSR, Interaktiv und Hybrid."
---
![cover](/images/posts/blazor-developers/cover-de.png)
## Blazor für Entwickler
**[English Version](https://github.com/AlexNek/Blazor-for-You/blob/master/ForDevelopers/readme.md)**


### Überblick
In diesem Artikel gehen wir nicht noch einmal auf das grundlegende Blazor-Tutorial ein. Viele Ressourcen decken bereits dieses Thema ab. Stattdessen werden wir uns auf die spezifischen Herausforderungen konzentrieren, die sich Entwicklern bei der Verwendung der neuen Rendering-Modi in .NET 8 und höher stellen können.

Der Artikel ist nicht einfach, weil er eine Menge Informationen enthält, und ich habe versucht, sie aufzuschlüsseln.
![image](/images/posts/blazor-developers/article.png)

Für Beispiele besuchen Sie das [Beispiel-Repository](https://github.com/AlexNek/BlazorNet8PlusExamples). Dort finden Sie auch eine detaillierte [Beschreibung der Beispiele](https://github.com/AlexNek/BlazorNet8PlusExamples/blob/master/readme-de.md). Alternativ können Sie direkt mit den Demos starten: [Demo 1](https://blazornet9rendermodes.azurewebsites.net) oder [Demo 2](https://blazorauthentication202412.azurewebsites.net).

### Einführung in die neuen Render-Modi von Blazor

Blazor hat kürzlich einige coole Updates erhalten, die Entwicklern neue Möglichkeiten bieten, Inhalte in .NET 8 und darüber hinaus zu rendern. Statt sich auf einen starren Ansatz zu beschränken, können Sie nun verschiedene Rendering-Methoden kombinieren, je nach den Anforderungen Ihrer Anwendung.

Lassen Sie uns das aufschlüsseln:  

- **Statisch (SSR)**: Stellen Sie sich dies vor, als ob vorab gerenderte Inhalte direkt an Ihre Benutzer ausgeliefert werden. Der Server sendet vollständig gerendertes HTML, sodass Seiten schnell geladen werden und gut für Suchmaschinen sind. Dies ist ideal für Szenarien, bei denen Geschwindigkeit und SEO am wichtigsten sind, wie z. B. öffentliche Websites oder Blogs.

- **Interaktiv (Server oder Client)**: Wenn Ihre Anwendung reaktionsfähig und dynamisch sein soll, kommt interaktives Rendering ins Spiel. Es beginnt mit der Auslieferung vorab gerenderter Inhalte für ein schnelles Laden, wechselt dann aber zu clientseitigen Updates mithilfe von WebAssembly oder serverseitigen Updates mit Blazor Server. Es ist ideal für Dashboards oder Apps, die eine kontinuierliche Benutzerinteraktion erfordern.  

- **Hybrid (Auto)**: Nicht alles in einer App passt sauber in eine Kategorie, und hier glänzt der hybride Modus. Er kombiniert die Vorteile von SSR und Interaktivität, indem er mit serverseitigem Inhalt für Geschwindigkeit startet und dann bei Bedarf auf clientseitiges Rendering umschaltet. Es ist eine großartige Wahl für Apps, die sowohl Flexibilität als auch Leistung erfordern.

Obwohl diese Modi einen flexiblen Ansatz bieten, der Geschwindigkeit, Interaktivität und Kontrolle kombiniert, erhöhen sie auch die Komplexität der Entwicklung.

## Die richtige Wahl des Modus

Die Entscheidung, wie Ihre App gerendert werden soll, ist nicht nur eine einzelne Wahl – es geht darum, die einzigartigen Anforderungen Ihrer Anwendung zu verstehen. Mit den flexiblen Rendering-Optionen von Blazor können Sie jedem Teil Ihrer Anwendung seinen spezifischen Zweck zuweisen und sowohl die Leistung als auch das Benutzererlebnis sicherstellen.

![image](/images/posts/blazor-developers/render-modes.png)

### Render-Modi auf verschiedenen Ebenen  

Blazor zwingt Sie nicht dazu, eine einzige Rendering-Strategie für die gesamte Anwendung zu verwenden. Stattdessen können Sie es auf drei verschiedenen Ebenen fein abstimmen:

- **Anwendungsebene:** Definieren Sie eine Standard-Rendering-Strategie für die gesamte Anwendung. Wenn beispielsweise die Mehrheit Ihrer Seiten schnelles Laden und starke SEO-Leistung priorisiert, wäre die Übernahme von SSR als globaler Standard eine praktische Wahl. Zusätzlich können Sie Rendering-Ansätze auf anderen Ebenen anpassen, um spezifische Anforderungen zu erfüllen.
 
- **Seitenebene:** Überschreiben Sie die globale Einstellung für bestimmte Seiten. Eine Seite mit komplexer Interaktivität, wie ein Dashboard oder eine Live-Chat-Oberfläche, könnte einen interaktiven Modus verwenden, um Echtzeit-Updates zu gewährleisten.

- **Komponentenebene:** Übernehmen Sie die Kontrolle über einzelne Elemente, indem Sie Render-Modi für spezifische Komponenten zuweisen. Beispielsweise könnte eine Produktseite SSR für das Layout verwenden, jedoch eine interaktive Komponente für den Warenkorb oder den Bewertungsbereich enthalten.


Diese Struktur gibt Ihnen die Möglichkeit, das Verhalten Ihrer App auf jeder Ebene anzupassen und Leistung, Skalierbarkeit und Interaktivität genau dort auszubalancieren, wo sie benötigt werden. 

### Anpassungsfähigkeit der Render-Modi

Blazor bietet die Möglichkeit, zwischen **festen** und **variablen** Render-Modi zu wählen, je nachdem, wie flexibel Ihre App sein soll:

- **Fester Modus:** Bleibt während des gesamten Lebenszyklus der App bei einer einzigen Rendering-Methode – wie SSR oder Interaktiv. Er ist einfach und funktioniert gut für statische Seiten oder Bereiche mit begrenzter Interaktivität.

- **Variabler Modus:** Passt sich dynamisch an und wechselt den Render-Modus je nach dem, was in der App passiert. Eine Produktseite könnte zum Beispiel mit SSR für schnelles Laden und SEO beginnen, aber in den interaktiven Modus wechseln, um Funktionen wie das Hinzufügen von Artikeln zum Warenkorb zu ermöglichen.

Variable Modi sind besonders nützlich für Apps, bei denen verschiedene Teile sehr unterschiedliche Zwecke erfüllen. Bedenken Sie jedoch, dass es entscheidend ist, diese Übergänge reibungslos zu verwalten, um eine nahtlose Benutzererfahrung zu gewährleisten.

### Faktoren bei der Wahl des Modus

Bei der Wahl zwischen SSR und Interaktiv-Modi ist es wichtig, die spezifischen Anforderungen Ihrer Anwendung zu bewerten. Faktoren wie Leistung, Skalierbarkeit, Benutzererfahrung und betriebliche Anforderungen spielen eine entscheidende Rolle bei der Bestimmung des besten Ansatzes. Eine detaillierte Vergleichstabelle dieser Kernmerkmale, die die Fähigkeiten, Einschränkungen und die besten Szenarien für jeden Render-Modus hervorhebt, finden Sie **--> 

## Faktoren, die bei der Wahl eines Modus berücksichtigt werden sollten

In diesem Abschnitt gehen wir auf die wichtigsten Faktoren ein, die Ihre Entscheidung beim Wählen zwischen SSR und interaktiven Modi leiten sollten:

1. Hauptmerkmale der Darstellung und Interaktion
2. Zustand und Navigation
3. JavaScript und externe Interoperabilität
4. Benutzererfahrungsfunktionen
5. Erweiterte Entwicklerfunktionen
6. Skalierbarkeit und Leistungsüberlegungen
7. Sicherheitsüberlegungen
8. Bereitstellung und Hosting
9. Entwicklung und Debugging
10. Übergang zwischen Modi
11. Erweiterte Entwicklerfunktionen
12. Weitere Überlegungen

### 1. Hauptmerkmale der Darstellung und Interaktion
Als Grundlage des Renderings legen diese Funktionen die technischen Fähigkeiten und Einschränkungen jedes Modus fest.

| Faktor                      | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client  |
|-----------------------------|-----------------------------------|---------------------|----------------------|
| **Initiale Ladeleistung**   | **Schnellere Initialladung**: Vorgefertigtes HTML wird sofort gesendet | **Moderat**: Die anfängliche Ladezeit umfasst einige Interaktivitätsvorbereitungen | **Langsam**: Erfordert das Laden und Initialisieren clientseitiger Ressourcen |
| **Benutzerinteraktion**     | **Eingeschränkt**: Nur statische Inhalte bis das clientseitige Rendering beginnt | **Teilweise**: Servergesteuerte Interaktivität mit potenzieller Latenz | **Vollständig**: Sofortige clientseitige Interaktivität, sobald clientseitige Ressourcen geladen sind |
| **Dynamische Inhaltsaktualisierungen** | **Nicht unterstützt**: Erfordert vollständige Seitenaktualisierung. | **Unterstützt** durch Server-Roundtrips | **Vollständig unterstützt**: Echtzeitaktualisierungen ohne Seitenaktualisierung. |
| **Ereignisbehandlung**      | Nicht unterstützt beim ersten Rendering | Wird auf dem Server behandelt, mit potenzieller Netzwerk-Latenz | Wird sofort auf dem Client behandelt |
| **OnAfterRenderAsync**      | **Nicht ausgelöst**: Nur nach interaktivem Rendering aufgerufen | **Unterstützt**:Funktion wird auf dem Server aufgerufen mit möglicher Netzwerkverzögerung für den Client |  **Voll unterstützt**: sofortige Ausführung im Browser ohne Latenz (nach clientseitigem Laden) |

---
### 2. Zustandsverwaltung und Navigation

Die Zustandsverwaltung und Navigation sind grundlegende Aspekte beim Erstellen interaktiver Webanwendungen und stehen in engem Zusammenhang mit dem Rendering.

| Faktor                  | SSR (Static Server Render) | Interaktiver Server | Interaktiver Client  |
|--------------------------|----------------------------|----------------------|-----------------------|
| **Zustandsverwaltung** | **Eingeschränkt**: Verlässt sich auf serverseitige Lösungen wie In-Memory-Speicher, verteiltes Caching, Datenbanken usw. | **Unterstützt**: Der Zustand wird auf dem Server verwaltet, oft mit SignalR für Echtzeit-Updates | **Vollständig unterstützt**: Reiche clientseitige Zustandsverwaltungsoptionen mit Frameworks wie Redux oder MobX |
| **Zustandspersistenz** | **Eingeschränkt**: Der Zustand kann mit verschiedenen Speichermechanismen auf dem Server persistent gemacht werden. Dies ermöglicht die Verwaltung des Sitzungszustands über mehrere Anfragen hinweg, auch wenn jede Anfrage zustandslos ist. | **Unterstützt**: Der Zustand bleibt während der Sitzung auf dem Server bestehen | **Vollständig unterstützt**: Clientseitige Zustandspersistenz über Interaktionen hinweg, auch offline |
| **Navigation Manager** | **Eingeschränkt**: Kann nur über serverseitige Umleitung navigieren | **Unterstützt**: Ermöglicht clientseitige Navigation mit SPA-ähnlicher Funktionalität unter Verwendung von SignalR | **Vollständig unterstützt**: Unterstützt clientseitige Navigation mit voller SPA-Funktionalität |

**Anmerkungen:**

1. **Zustandsverwaltung:**
   - SSR verlässt sich auf serverseitige Mechanismen wie In-Memory-Speicher, verteiltes Caching, Datenbanken usw., was für dynamische Anwendungen einschränkend sein kann. Komponenten werden als statisches HTML gerendert.
   - Der interaktive Server verwaltet den Zustand auf dem Server und bietet Echtzeit-Updates, erfordert jedoch eine konstante Verbindung.
   - Der interaktive Client bietet eine robuste clientseitige Zustandsverwaltung mit verschiedenen Bibliotheken und Tools.

2. **Zustandspersistenz:**
   -  Da SSR zustandslos ist, muss der Zustand bei jeder Anfrage neu geladen werden. Es ist zwar möglich, den Zustand mithilfe verschiedener Speichermechanismen auf dem Server aufrechtzuerhalten, doch müssen alle Zustandsinformationen bei jeder Anfrage neu geladen werden, was zu Ineffizienz und längeren Ladezeiten führen kann.
   - Der interaktive Server hält den Zustand während der Benutzersitzungen aufrecht, was das Benutzererlebnis verbessern kann.
   - Der interaktive Client kann den Zustand über Sitzungen hinweg persistent machen und sogar Offline-Szenarien unterstützen.

3. **Navigation Manager:**
   - SSR behandelt die Navigation in der Regel durch vollständige Seitenneuladungen. Siehe auch 

## Behandlung von `NavigationManager.NavigateTo()`-Ausnahmen in Blazor SSR

### Verständnis des Problems

In .NET 8/9 Blazor Server-Side Rendering (SSR) kann die Verwendung von `NavigationManager.NavigateTo()` aufgrund der aktuellen Einschränkungen im SSR-Modus Ausnahmen auslösen. Dieses Problem ist in den folgenden GitHub-Diskussionen dokumentiert:

- [NavigationManager.NavigateTo() Inkonsistentes Verhalten](https://github.com/dotnet/aspnetcore/issues/53996)
- [NavigationException wird beim Verwenden von NavigationManager.NavigateTo nach Formularübermittlung in SSR ausgelöst](https://github.com/dotnet/aspnetcore/issues/50478)

Bis Microsoft eine offizielle Lösung bereitstellt, können Entwickler mehrere Workarounds erkunden.

---

### Workarounds

#### 1. Serverseitige Weiterleitungen
Für einfache Szenarien können Sie `context.Response.Redirect("/your-route")` in Ihrem serverseitigen Code verwenden.

 **Beispiel:**

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

#### 2. Benutzerdefinierte Erweiterungsmethode für `HttpContext`

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

#### 3. Benutzerdefiniertes Middleware
Für komplexere Weiterleitungslogiken erstellen Sie Middleware.

#### 4. Debugging-Einstellungen anpassen
Konfigurieren Sie Visual Studio, um diese Ausnahme beim Debuggen zu ignorieren.

#### 5. Auf einen offiziellen Fix warten
Dieses Problem wird auf GitHub aktiv verfolgt.

---

### Schlussfolgerung

Während diese Workarounds vorübergehende Lösungen bieten, halten Sie Ihr Projekt aktuell, um von offiziellen Fixes zu profitieren.
.
   - Der interaktive Server kann glattere Navigationserlebnisse ähnlich wie Single Page Applications (SPAs) mit Technologien wie SignalR bieten.
   - Der interaktive Client unterstützt vollständig die SPA-Navigation und bietet nahtlose Übergänge ohne vollständige Seitenneuladungen.

---

### 3. JavaScript und externe Interoperabilität
Interop-Fähigkeiten sind entscheidend für die Integration mit externen Bibliotheken und die Hinzufügung erweiterter clientseitiger Funktionalitäten.

| Faktor | SSR (Static Server Render) | Interaktiv |
|--------|----------------------------|-------------|
| **JavaScript ohne Rückgabewert** | **Teilweise unterstützt**: Enqueue-Aufrufe für spätere Ausführung auf dem Web-Client | **Vollständig unterstützt**: Sofortige Ausführung von JavaScript-Funktionen |
| **JavaScript mit Rückgabewert** | **Nicht unterstützt**: JavaScript, das Rückgabewerte benötigt, kann nicht ausgeführt werden| **Vollständig unterstützt**: Ermöglicht das Aufrufen von JavaScript-Funktionen und das Abrufen von Rückgabewerten |
| **C#-Callback von JavaScript** | **Nicht unterstützt**: In diesem Modus können keine C#-Methoden aus JavaScript aufgerufen werden | **Vollständig unterstützt**: JavaScript kann C#-Methoden direkt mit Parametern aufrufen |
| **`IJSRuntime`-Unterstützung** | **Nicht unterstützt**: JavaScript-Interop mit `IJSRuntime` wird im SSR-Modus nicht unterstützt, da es keine aktive Blazor-Laufzeit auf der serverseitig gerenderten Seite gibt. Es muss stattdessen reines JavaScript verwendet werden | **Vollständig unterstützt**: `IJSRuntime` ist verfügbar, um JavaScript-Funktionen aufzurufen und Daten zwischen Blazor und dem clientseitigen JavaScript zu übergeben  |

**Anmerkung**: Im **SSR-Modus** ist JavaScript-Interop mit **`IJSRuntime`** nicht verfügbar, da die Blazor-Laufzeit auf dem Client noch nicht initialisiert wurde. Jegliches benötigte JavaScript vor der Hydratisierung muss über standardmäßiges HTML und JavaScript ausgeführt werden. Sobald die Seite hydratisiert ist und Blazor interaktiv wird, können Sie **`IJSRuntime`** für eine dynamischere Interaktivität verwenden.

---

### 4. Benutzererfahrungsfunktionen
Diese Funktionen haben einen direkten Einfluss darauf, wie die Anwendung von den Benutzern wahrgenommen wird, und stellen eine natürliche Erweiterung der Interaktivität und Navigation dar.

| Faktor                              | SSR (Statisches Server-Rendering)    | Interaktiv    |
|-------------------------------------|--------------------------------------|---------------|
| **Formularvalidierung**             | **Nur serverseitig**: Erfordert Roundtrips für die Validierungslogik | **Vollständig unterstützt**: Echtzeit-Client-seitige Validierung wird unterstützt |
| **SEO und Metadaten-Rendering**     | **Vollständig unterstützt**: Der Inhalt wird vollständig serverseitig gerendert und ist durchsuchbar | **Teilweise unterstützt**: Erfordert zusätzlichen Aufwand, damit Crawler dynamischen Inhalt verarbeiten können |
| **Offline-Unterstützung**           | **Nicht unterstützt**: Vollständig serverabhängig | **Unterstützt**: Möglich mit Blazor WebAssembly |

---

### 5. Fortgeschrittene Entwicklerfunktionen
Sicherzustellen, dass die Anwendung für alle benutzbar ist, ist eine logische Fortsetzung nach der Abdeckung der grundlegenden Benutzererfahrungsaspekte.

| Faktor                              | SSR (Statisches Server-Rendering)    | Interaktiv    |
|-------------------------------------|--------------------------------------|---------------|
| **HttpContext-Sichtbarkeit**        | **Unterstützt**: Während der serverseitigen Ausführung verfügbar | **Nicht unterstützt**: Nach der Umstellung auf den Client nicht direkt zugänglich |
| **RenderFragment**                  |  **Unterstützt**: RenderFragment can be used but limited to static context | **Vollständig unterstützt** für die App- und Seiten-Render-Modi Deklaration<br>**Nicht unterstützt** für die Deklaration des Komponenten-Rendering-Modus |
| **Fehlerbehandlung**                | Serverseitige Fehler können während des Renderings abgefangen und behandelt werden. Fallback-Inhalte oder Fehlerseiten können bereitgestellt werden | Clientseitige Laufzeitfehler müssen in der Benutzerschnittstelle behandelt werden, typischerweise mit Fehlergrenzen oder Try-Catch-Blöcken. Server-Fehler bei API-Aufrufen müssen separat behandelt werden |

### 6. Skalierbarkeit und Leistungsüberlegungen

Leistung und Skalierbarkeit sind sowohl für die Benutzererfahrung als auch für das Systemdesign wichtig. Sie verbinden benutzerorientierte Aspekte mit technischen und betrieblichen Anliegen.

| Faktor                          | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktives WebAssembly |
|----------------------------------|----------------------------------|---------------------|-----------------|
| **Serverlast**                   | **Höher**: Jede Benutzerinteraktion erfordert eine Serveranforderung | **Moderat**: Der Server verarbeitet UI-Updates und das State-Management, aber weniger häufig als bei SSR | **Geringer**: Client-seitiges Rendering reduziert Serverlast |
| **Bandbreitennutzung**           | **Minimal**: Nur das notwendige HTML und die Assets für den ersten Ladevorgang werden gesendet | **Moderat bis hoch**: Ständige SignalR-Verbindung für Echtzeit-Updates | **Höher**: Erfordert initialen Download von .NET Runtime und Application Bundle |
| **Gleichzeitige Benutzer**       | Durch die Serverkapazität begrenzt, da jede Benutzersitzung Ressourcen benötigt | Skaliert gut mit zusätzlichen Servern, aber ist immer noch auf Serverressourcen angewiesen | Skaliert gut, da die Client-seitige Verarbeitung die Serverlast verringert |

**Anmerkung:** Während der Interaktive Server eine bessere Skalierbarkeit als SSR bietet, ist er immer noch auf Serverressourcen für UI-Updates und das State-Management angewiesen. Das Interaktive WebAssembly hingegen kann besser skalieren, indem die Verarbeitung auf die Client-Seite ausgelagert wird.

---

### 6. Skalierbarkeit und Leistungsüberlegungen

Leistung und Skalierbarkeit sind sowohl für die Benutzererfahrung als auch für das Systemdesign von Bedeutung. Sie verbinden benutzerorientierte Aspekte mit technischen und betrieblichen Anliegen.

| Faktor | SSR (Static Server Render) | Interaktiver Server | Interaktives WebAssembly |
|---|---|---|---|
| **Serverlast** | **Höher**: Jede Benutzerinteraktion erfordert eine Serveranfrage | **Moderat**: Server verwaltet UI-Updates und Zustandsverwaltung, aber weniger häufig als SSR | **Niedriger**: Clientseitiges Rendering reduziert die Serverlast |
| **Anfangsladezeit** | **Schneller**, insbesondere für statischen Inhalt | **Schneller** als WebAssembly, aber langsamer als SSR | **Langsamer** aufgrund des .NET-Laufzeitumgebung- und App-Bundle-Downloads |
| **Bandbreitennutzung** | **Minimal**: Sendet nur das notwendige HTML und die Assets für den ersten Ladevorgang | **Moderat**: Kontinuierliche SignalR-Verbindung für Echtzeit-Updates | **Höher**: Erfordert den anfänglichen Download der .NET-Laufzeitumgebung und des Anwendungsbundles |
| **Gleichzeitige Benutzer** | **Begrenzt**: Durch die Serverkapazität, da jede Benutzersitzung Ressourcen benötigt | **Skaliert** mit zusätzlichen Servern, hat jedoch Einschränkungen durch die SignalR-Infrastruktur und die Komplexität der Anwendung | **Skaliert gut**: Da die clientseitige Verarbeitung die Serverlast reduziert |
| **Auswirkungen der Netzwerklatenz** | **Weniger betroffen** von Netzwerkverzögerungen. | **Stark betroffen** von Netzwerkverzögerungen, insbesondere für Echtzeit-Updates | **Stark betroffen** von Netzwerkverzögerungen während des anfänglichen Downloads. <br> **Nicht betroffen**: Kann offline oder in unzuverlässigen Netzwerken nach dem ersten Ladevorgang funktionieren |

**Anmerkung:** Interactive Server bietet zwar eine bessere Skalierbarkeit als SSR, benötigt aber immer noch Server-Ressourcen für die Aktualisierung der Benutzeroberfläche und die Statusverwaltung. Interactive WebAssembly hingegen ist besser skalierbar, da die Verarbeitung auf die Clientseite verlagert wird.

---

### 7. Sicherheitsüberlegungen

Sicherheit ist entscheidend für den Schutz von Anwendungen, Daten und Benutzern und muss daher vor der Implementierung behandelt werden.

| Faktor                          | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client |
|----------------------------------|----------------------------------|---------------------|---------------------|
| **Umgang mit sensiblen Daten**   | **Sicherer**: Daten werden auf dem Server verarbeitet und gespeichert, wodurch die Exposition verringert wird | **Sicherer**: Sensible Daten werden hauptsächlich auf dem Server verarbeitet, wodurch die Exposition auf der Client-Seite minimiert wird | **Risikoreicher**: Mehr Daten und Logik sind auf der Client-Seite exponiert, was potenzielle Schwachstellen erhöht |
| **Authentifizierung**            | Vollständig unterstützt mit serverseitigen Sitzungen oder Cookies, um eine sichere Verwaltung zu gewährleisten | Vollständig unterstützt mit serverseitigen Sitzungen oder tokenbasierter Authentifizierung, was eine robuste Sicherheit bietet | Vollständig unterstützt, oft unter Verwendung tokenbasierter Authentifizierung, erfordert jedoch sorgfältige Handhabung, um Token-Exposition zu verhindern |
| **Cross-Site Scripting (XSS)**   | **Geringeres Risiko**: Keine clientseitige Ausführung während des ersten Ladevorgangs, was XSS-Vektoren verringert | **Geringeres Risiko**: Serverseitiges Rendering minimiert die direkte Exposition der Client-Seite gegenüber XSS| **Höheres Risiko**: Erfordert eine sorgfältige Sanitierung von Client-seitigen Eingaben und eine Ausgabe-Kodierung, um XSS-Angriffe zu verhindern |

**Anmerkungen:**
- SSR und Interaktiver Server verarbeiten Daten auf dem Server. Dies hilft, sensible Informationen sicher zu halten und zu verhindern, dass sie von Clients eingesehen werden.
- Interaktive Client-Anwendungen müssen robuste Sicherheitspraktiken implementieren, um Risiken im Zusammenhang mit der Exposition und Manipulation von Client-seitigen Daten zu mindern.
- Authentifizierungsmechanismen sind in allen Modellen im Allgemeinen robust, erfordern jedoch eine sorgfältige Implementierung, um sicherzustellen, dass Token oder Sitzungsbezeichner nicht exponiert werden.

### 8. Softwareverteilung und Hosting

Mit der Sicherheit im Hinterkopf ist die Softwareverteilung und das Hosting der nächste logische Schritt, der sich damit beschäftigt, wie die Anwendung effektiv betrieben werden kann.

| Faktor                           | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client |
|----------------------------------|----------------------------------|---------------------|---------------------|
| **Hosting-Anforderungen**        | Erfordert einen leistungsfähigen Server, um SSR-Anfragen zu verarbeiten (z. B. ASP.NET Core) | Erfordert einen Server, um Echtzeit-Interaktionen zu verwalten (z. B. SignalR) | Kann vollständig auf statischen Hosting-Plattformen laufen |
| **Edge- oder CDN-Unterstützung** | Eingeschränkt: Erfordert einen Ursprungsserver für dynamisches Rendering. Moderne CDNs können einige dynamische Inhalte zwischenspeichern, sind jedoch weiterhin auf Serververarbeitung angewiesen | Eingeschränkt: Echtzeit-Updates hängen von Serververbindungen ab; moderne CDNs können die Bereitstellung beschleunigen | Vollständig unterstützt: Statische Ressourcen können global zwischengespeichert werden, während dynamische Inhalte clientseitig verarbeitet werden |
| **

## Kernkonzept

Progressive Enhancement bedeutet, eine Website zu erstellen, die:

1. Für alle Benutzer funktioniert, unabhängig von ihrem Gerät oder Browser
2. Mit grundlegenden Inhalten und Funktionen beginnt
3. Weitere fortschrittliche Funktionen für Benutzer mit modernen Browsern hinzufügt

## Wie es funktioniert

Stellen Sie sich vor, Sie bauen eine Torte:

1. **Basis-Schicht (HTML):** Der grundlegende Inhalt, auf den jeder zugreifen kann
2. **Mittlere Schicht (CSS):** Verbessert das Aussehen und Layout
3. **Oberste Schicht (JavaScript):** Fügt interaktive Funktionen hinzu

## Vorteile

- **Barrierefreiheit:** Stellt sicher, dass Inhalte für alle Benutzer zugänglich sind
- **Leistung:** Schnellere Ladezeiten für grundlegende Inhalte
- **Flexibilität:** Funktioniert auf verschiedenen Geräten und Browsern

## In einfacheren Worten

Es ist wie das Design eines Autos, das ein Basismodell hat, das jeder fahren kann, Luxusfunktionen bietet, aber dennoch von A nach B bringt.

Progressive Enhancement bedeutet, Websites zu erstellen, die inklusiv und anpassungsfähig sind.
** | Vollständig unterstützt: Funktioniert auch in Umgebungen 

## Wie Progressive Enhancement im SSR-Modus funktioniert

1. **HTML-Kerndistribution:** Der Server generiert und sendet vollständig gerendertes HTML an den Client, sodass sofort auf wesentliche Inhalte zugegriffen werden kann, auch ohne JavaScript.

2. **Schichtansatz:** Die Anwendung wird schrittweise aufgebaut, beginnend mit semantischem HTML, gefolgt von CSS und JavaScript.

3. **Basisfunktionalität:** Alle grundlegenden Funktionen arbeiten mit standardmäßigen HTML-Elementen wie Formularen und Links.

4. **JavaScript-Erweiterungen:** Sobald die Seite geladen ist, fügt JavaScript zusätzliche Interaktivität hinzu.

5. **Fallback-Mechanismen:** Einige Funktionen haben einfachere Fallbacks.

6. **Semantische HTML-Basis:** Der Kern basiert auf gut strukturiertem, semantischem HTML.

Durch die Implementierung von Progressive Enhancement im SSR-Modus erstellen Entwickler robuste Anwendungen. Die grundlegenden Inhalte bleiben zugänglich, selbst wenn JavaScript deaktiviert ist.
 | Teilweise unterstützt: Erfordert JavaScript für Echtzeit-Interaktionen | Erfordert JavaScript für Funktionalitäten über den initialen Ladeprozess hinaus |

**Anmerkungen:**

- **Hosting-Anforderungen:** SSR und Interaktiver Server erfordern beide Serverressourcen, aber der Interaktive Client (WebAssembly) kann auf statischen Plattformen gehostet werden, was den Infrastrukturbedarf verringert.
- **Edge- oder CDN-Unterstützung:** Der Interaktive Client profitiert vom globalen Caching statischer Assets, während SSR und Interaktiver Server aufgrund ihrer Abhängigkeit von serverseitiger Verarbeitung Einschränkungen aufweisen, obwohl moderne CDNs die Bereitstellung dynamischer Inhalte optimieren können.
- **Progressive Enhancement:** SSR unterstützt Umgebungen ohne JavaScript, während sowohl der Interaktive Server als auch der Client für die vollständige Funktionalität auf JavaScript angewiesen sind.

---

### 9. Entwicklung und Debugging

Nachdem das Hosting behandelt wurde, verschiebt sich der Fokus darauf, wie Entwickler mit diesen Modi während des Entwicklungszyklus arbeiten.

| Faktor                            | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client |
|----------------------------------|----------------------------------|---------------------|---------------------|
| **Entwicklungs-Komplexität**     | **Niedriger**: Einfaches, traditionelles serverseitiges Rendering-Modell. | **Moderat**: Beinhaltet sowohl serverseitige Logik als auch Echtzeit-Browser-Interaktionen, nutzt jedoch oft bestehende serverseitige Frameworks | **Höher**: Beinhaltet sowohl clientseitige als auch serverseitige Logik, was oft komplexere Tools erfordert |
| **Debugging-Tools**              | Standard serverseitige Debugging-Tools | Kombination aus serverseitigen und browserbasierten Debugging-Tools | Primär browserbasierte Debugging-Tools |
| **Hot Reload-Unterstützung**     | **Vollständig unterstützt** in der serverseitigen Entwicklung | **Unterstützt**, aber Änderungen müssen mit dem Client synchronisiert werden | **Unterstützt**, aber Änderungen müssen mit dem Client synchronisiert werden |

**Anmerkungen:**

1. **IDE-Unterstützung in verschiedenen Modi:**
   - Alle gängigen IDEs, einschließlich **Visual Studio**, **JetBrains Rider** und **VS Code**, unterstützen vollständig das Debugging in den Modi SSR, Interactive Server und Interactive Client.
   - Funktionen wie **Hot Reload**, **Breakpoints** und **WASM-Debugging** sind weit verbreitet und einfach einzurichten.

2. **Browser-basierte Debugging-Tools:**
   - In den Modi **Interactive Client** und **WASM** sind browserbasierte Debugging-Tools (wie Chrome DevTools oder Edge Developer Tools) unerlässlich.
   - Einige Aspekte des Debuggings, wie DOM-Manipulation, JavaScript-Ausführungsfluss und clientseitige Performance-Profiling, sind **nur** innerhalb der Entwicklertools des Browsers möglich.
   - Diese Tools bieten einzigartige Funktionen wie die Echtzeit-Inspektion des DOM, Breakpoints für JavaScript, Performance-Profiling und die Möglichkeit, direkt mit der Browserumgebung zu interagieren, was nicht immer vollständig in IDEs nachgebildet werden kann.
   - Daher sollten Entwickler eine Kombination aus IDE- und Browser-Tools verwenden, um vollständige Debugging-Fähigkeiten zu erreichen, wenn sie mit clientseitigen oder interaktiven Blazor-Anwendungen arbeiten.

3. **Historischer Kontext der Komplexität:**
   - Frühere Debugging-Workflows, insbesondere für WASM und Interactive Client, erforderten zusätzliche Einrichtungen, besonders in IDEs wie VS Code. Dies schuf den Eindruck einer höheren Komplexität.
   - Im Laufe der Zeit haben verbesserte Tools in allen IDEs den Debugging-Prozess vereinfacht und viele der früheren Hürden beseitigt.
---

### 10. Übergang zwischen Modi
Nachdem erläutert wurde, wie die "Hosting"-Szenarien entwickelt und betrieben werden, wird in diesem Abschnitt beschrieben, wie die "Transition"- und "Hybrid"-Szenarien ablaufen.

| Faktor | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client | Interaktiver Auto |
|--------|-----------------------------------|---------------------|---------------------|-------------------|
| **Erhaltungszustand** | **Manuell**: Erfordert das Übertragen von Zustand zwischen Anfragen | **Automatisch**: Zustand bleibt während der Sitzung auf dem Server erhalten | **Automatisch**: Zustand bleibt im Browser des Clients erhalten. | **Adaptiv**: Zustandserhaltung hängt vom gewählten Render-Modus für jede Komponente ab |
| **Dynamisches Modus-Switching** | **Unterstützt**: Kann in jeden interaktiven Modus wechseln. Der Wechsel zum interaktiven Client erfordert normalerweise ein vollständiges Neuladen | **Unterstützt**: Kann mit minimaler Störung vom SSR-Modus wechseln, da die Verbindung persistent ist | **Unterstützt**: Kann vom SSR-Modus wechseln, erfordert jedoch in der Regel ein vollständiges Neuladen und zusätzliches Laden des WebAssembly-Laufzeitumgebung | **Dynamisch**: Wählt den Render-Modus basierend auf dem aktuellen Kontext, kann zwischen Server- und Client-Modus wechseln |
| **Ressourcennutzung** | Server-Ressourcen werden über Anfragen hinweg wiederverwendet, aber nicht mit dem Client geteilt | Server-Ressourcen werden über Anfragen hinweg und für SignalR-Verbindungen wiederverwendet | Client-Ressourcen bleiben lokal erhalten, Server-Ressourcen werden über API-Aufrufe abgerufen | Passt die Ressourcennutzung basierend auf dem gewählten Render-Modus an |

**Anmerkungen:**

1. **Erhaltungszustand**:
   - Beim **Interaktiven Server** bleibt der Zustand während der Sitzung auf dem Server erhalten.
   - Beim **Interaktiven Client** wird der Zustand im Browser gespeichert.
   - Bei **Interactive Auto** wird die Zustandserhaltung für jede Komponente entsprechend dem gewählten Rendering-Modus angepasst. Die Zustandserhaltung erfolgt nicht automatisch über die verschiedenen Rendermodi hinweg.

2. **Dynamischer Moduswechsel**
   - **Modusübergänge:** Der Wechsel zwischen Render-Modi wird unterstützt, aber jeder Übergang erfordert sorgfältige Überlegung der damit verbundenen Auswirkungen.
   - **Interaktiver Auto-Modus:** Dieser Modus bestimmt dynamisch den geeigneten Render-Modus (Server oder Client) basierend auf dem aktuellen Kontext und dem Interaktivitätsgrad der Seite. Er priorisiert die Auswahl eines Render-Modus, der mit den vorhandenen interaktiven Komponenten übereinstimmt, um die Erstellung einer neuen interaktiven Laufzeitumgebung ohne gemeinsamen Zustand zu vermeiden.
   - **Entscheidungen pro Komponente/Laden:** Der Auto-Modus bewertet und entscheidet den Render-Modus für jede Komponente oder Seitenladen unabhängig, anstatt einen festen Modus für die gesamte Sitzung anzuwenden.
   - **Warnung bei zustandsbehafteten Diensten:** Seien Sie vorsichtig bei der Verwendung zustandsbehafteter Dienste, da der gewählte Render-Modus zwischen serverbasierten und clientbasierten Diensten wechseln kann, was die Zustandsverwaltung beeinflussen könnte.
   
3. **Ressourcennutzung**:
   - In SSR und Interaktivem Server werden serverseitige Ressourcen über Anfragen hinweg wiederverwendet, aber nicht mit dem Client geteilt.
   - Beim Interaktiven Client werden Ressourcen lokal im Browser verwaltet, wobei serverseitige Ressourcen über API-Aufrufe abgerufen werden.
   - Der Interaktive Auto-Modus passt die Ressourcennutzung je nach gewähltem Render-Modus für jede Komponente an.

4. **Moduswechsel**

 Wichtige Punkte beim Wechsel zwischen den Modi:

 - **Kaskadierende Parameter**:
    - Stellen Sie sicher, dass kaskadierende Parameter während der Übergänge korrekt wiederhergestellt werden, um Null-Referenzen zu vermeiden.
    - Stellen Sie Fallback-Standards bereit, wo dies notwendig ist.

 - **Parameter-Serialisierung**:
    - Sichern Sie die Datenintegrität während der Serialisierung und Deserialisierung.
    - Überprüfen Sie die Typkompatibilität zwischen serialisierten und deserialisierten Formaten.
    - Vergessen Sie nicht, einen Standardkonstruktor einzufügen, falls dies vom Serialisierungsframework erforderlich ist.

 - **Größe der Parameter-Serialisierung**:
    - Minimieren Sie die Größe der Parameterobjekte, um die Leistung während der Übergänge zu verbessern.
    - Erwägen Sie Lazy Loading oder das Übertragen nur der wesentlichen Daten, um die Nutzlastgröße zu reduzieren.

 - **Zustandssynchronisation**:
    - Implementieren Sie die Zustandshydratation, um sicherzustellen, dass Änderungen in einem Modus beim Übergang zu einem anderen Modus korrekt widergespiegelt werden.
    - Halten Sie die Konsistenz über die Rendering-Modi hinweg aufrecht, um das Benutzererlebnis zu verbessern.
---

### 11. Erweiterte Entwicklerfunktionen
Diese Funktionen sind optional, aber wichtig für fortgeschrittene Anwendungsfälle, daher sind sie später in der Reihenfolge sinnvoll.

| Faktor | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client |
|--------|-----------------------------------|---------------------|---------------------|
| **

## ARIA (Accessible Rich Internet Applications)

### Was ist ARIA?

ARIA ist ein Satz von HTML-Rollen und -Attributen, der vom W3C entwickelt wurde, um Web-Inhalte für Benutzer zu verbessern, die auf unterstützende Technologien wie Screenreader angewiesen sind.

### Zweck von ARIA

- **Verbesserung der Barrierefreiheit:** Bietet zusätzliche semantische Informationen über Elemente.
- **Definition von Rollen und Attributen:** Durch Rollen (z.B. "Button", "Alert") und Attribute (z.B. "aria-label", "aria-hidden").

### Warum ARIA verwenden?

- Native HTML-Elemente bieten nicht genügend Unterstützung für Barrierefreiheit.
- Komplexe, interaktive Webanwendungen, bei denen natives HTML das Verhalten nicht vollständig beschreiben kann.

### Hauptvorteile

- **Verbesserte Barrierefreiheit:** Zugänglicher für Benutzer mit Behinderungen.
- **SEO-Vorteile:** Hilft bei der Suchmaschinenoptimierung.
- **Wartbarkeit:** Macht den Code lesbarer.

---

### Semantisches HTML

Semantisches HTML bezieht sich auf die Praxis, HTML-Elemente gemäß ihrem vorgesehenen Zweck zu verwenden.

#### Hauptunterschiede zwischen ARIA und semantischem HTML

- **Native Unterstützung vs. Ergänzung:** Semantisches HTML bietet eingebaute Barrierefreiheitsfunktionen. ARIA ergänzt, wenn komplexere Interaktionen erforderlich sind.
- **Anwendungsfälle:** Bevorzugen Sie immer semantisches HTML für die grundlegende Struktur. Verwenden Sie ARIA für komplexe Anwendungen.

#### Kombination von ARIA mit semantischem HTML

Durch die Kombination von ARIA-Attributen mit semantischem HTML erstellen Entwickler zugängliche und benutzerfreundliche Webanwendungen.
** | **Vollständig unterstützt**: Markup ist statisch und folgt den Standards problemlos | **Vollständig unterstützt**: Der Server generiert zugängliches Markup, aber es ist wichtig, dynamische Updates sorgfältig zu behandeln | **Vollständig unterstützt**: Erfordert sorgfältige Implementierung, um sicherzustellen, dass dynamisch generierter Inhalt zugänglich bleibt |
| **Tastaturnavigation** | Unterstützt für grundlegende Interaktionen: Native Browserfunktionen wie `Tab`-Navigation und Formularübermittlung sind verfügbar. <br>**Einschränkungen:** Komplexe Interaktionen (z. B. benutzerdefinierte Tastenkombinationen oder Echtzeit-Updates) werden nicht unterstützt und erfordern den interaktiven Modus | **Unterstützt**, aber erfordert auf dem Server eine ordnungsgemäße Ereignisbehandlung für benutzerdefinierte Interaktionen | **Unterstützt**, erfordert jedoch eine ordnungsgemäße Ereignisbehandlung im clientseitigen Code für benutzerdefinierte Interaktionen |
| **Kompatibilität mit Bildschirmlesern** | **Vollständig unterstützt**: Vorab gerenderte Inhalte funktionieren nahtlos mit Bildschirmlesern | **Unterstützt**, aber Echtzeit-Updates erfordern eine sorgfältige Implementierung, um sicherzustellen, dass Bildschirmleser Änderungen ankündigen | **Unterstützt**, erfordert jedoch eine sorgfältige Implementierung, um sicherzustellen, dass dynamisch aktualisierte Inhalte ordnungsgemäß von Bildschirmlesern angekündigt werden |

**Anmerkungen:** 

1. **ARIA und Semantisches HTML**: Alle Modi unterstützen dies, aber in den interaktiven Modi muss mehr Aufmerksamkeit darauf verwendet werden, dass dynamisch aktualisierte Inhalte weiterhin zugänglich sind.

2. **Tastaturnavigation**: Während grundlegende Navigation in allen Modi unterstützt wird, erfordern benutzerdefinierte Interaktionen in den interaktiven Modi spezifische Implementierungen, um die Tastaturzugänglichkeit sicherzustellen.

3. **Kompatibilität mit Bildschirmlesern**: SSR hat einen Vorteil bei der anfänglichen Inhaltszugänglichkeit, aber beide interaktiven Modi können eine gute Kompatibilität erreichen, wenn dynamische Inhaltsaktualisierungen korrekt implementiert werden.

---

### 12. Weitere Überlegungen
Dieser Abschnitt fasst verschiedene Faktoren zusammen, die nicht in andere Kategorien passen, aber dennoch wichtig sind.

| Faktor | SSR (Statisches Server-Rendering) | Interaktiver Server | Interaktiver Client |
|--------|-----------------------------------|---------------------|---------------------|
| **Offline-Modus** | **Eingeschränkt**: Kann mit Service-Workern für grundlegende Offline-Inhalte arbeiten, aber dynamische Funktionen erfordern eine Serververbindung | **Eingeschränkt**: Erfordert eine ständige Verbindung zum Server für die vollständige Funktionalität | **Unterstützt**: Kann mit richtiger Implementierung vollständige Offline-Funktionalität ermöglichen |
| **Progressive Web App (PWA)** | **Teilweise unterstützt**: Einige PWA-Funktionen können implementiert werden, sind jedoch durch die Serverabhängigkeit begrenzt. | **Teilweise unterstützt**: Einige PWA-Funktionen können implementiert werden, sind jedoch durch die Serverabhängigkeit begrenzt. | **Vollständig unterstützt**: Funktioniert nahtlos mit PWA-Funktionen, einschließlich Offline-Funktionalität. |
| **Caching-Strategien** | Funktioniert mit traditionellen serverseitigen Caching-Mechanismen und CDNs | Kombiniert serverseitiges Caching mit SignalR-Verbindungsmanagement für optimierte Leistung | Nutzt clientseitiges Caching und Service-Worker für verbesserte Leistung und Offline-Funktionen |

**Anmerkungen:**

1. **Offline-Modus**: 
   - SSR und Interaktiver Server haben Einschränkungen aufgrund der Serverabhängigkeit.
   - Der Interaktive Client (WebAssembly) bietet die beste Unterstützung für Offline-Funktionalität.

2. **Progressive Web App (PWA)**:
   - Alle Modi können einige PWA-Funktionen implementieren, aber der Interaktive Client bietet die umfassendste Unterstützung.

3. **Caching-Strategien**:
   - Jeder Modus hat unterschiedliche Caching-Ansätze, wobei der Interaktive Client die flexibelsten clientseitigen Caching-Optionen bietet.
 <--**.

#### Schneller Vergleich: SSR, Interaktiv und Hybrid Modi
Hier ist eine **Schnellvergleich**-Tabelle, die die wichtigsten Unterschiede zwischen den **SSR**, **Interaktiv** und **Hybrid**-Modi zusammenfasst. 

| Faktor  | SSR (Statische Serverseitige Darstellung) | Interaktiv (Server) | Interaktiv (Client) | Hybrid (Auto)|
|---------|-------------------------------------------|---------------------|---------------------|--------------|
| **Render-Standort**                   | Nur serverseitig                                                 | Server-seitig für Initial Load; Browser-seitig für Interaktivität (via Blazor Server) | Clientseitiges Rendering nach initialem serverseitigem Ladevorgang (via WebAssembly) | Serverseitig für den ersten Ladevorgang; Übergang zu clientseitigem Rendering (WebAssembly oder Blazor Server) nach Bedarf |
| **Erste Ladegeschwindigkeit**        | Schnell (vorab gerenderte HTML direkt gesendet)                   | Mäßig (einrichtung für Interaktivität erforderlich)           | Mäßig (anfängliche WebAssembly Ladezeit, aber danach schnell) | Schnell (anfänglich SSR, dann übernimmt clientseitig)                |
| **Interaktivität**                   | Eingeschränkte Interaktivität (statische Inhalte, bis die clientseitige Verarbeitung ggf. übernommen wird)               | Volle Interaktivität nach dem Laden der clientseitigen Ressourcen (via Blazor Server) | Volle Interaktivität nach dem Laden der clientseitigen Ressourcen (via WebAssembly) | Volle Interaktivität nach dem initialen serverseitigen Ladevorgang, mit Übergang zu clientseitiger Interaktivität |
| **SEO**                              | Ausgezeichnet (vollständig gerenderte Inhalte werden an den Client gesendet)  | Mäßig (dynamische Inhalte erfordern zusätzliche SEO-Behandlung) | Mäßig (dynamische Inhalte erfordern zusätzliche SEO-Behandlung) | Gut (initiales SSR bietet SEO-Vorteil, aber dynamische Inhalte erfordern clientseitige Handhabung) |
| **Statusverwaltung**                | Serverseitig (kein clientseitiger Status)                           | Serverseitig (SignalR für Echtzeit-Updates) | Clientseitig (der Client verwaltet die meisten Status über WebAssembly) | Mischung aus server- und clientseitiger Statusverwaltung (je nach Übergang) |
| **Verwendungsfall**                 | Am besten für statische oder hauptsächlich statische Webseiten (z.B. Blogs, Nachrichten-Websites) | Am besten für Echtzeit-Dashboards, Apps mit hoher Nutzerinteraktivität | Am besten für Single-Page-Apps oder Apps, die clientseitige Interaktivität und Offline-Unterstützung benötigen | Am besten für Apps, die sowohl schnelles Laden als auch dynamische Funktionen benötigen (z.B. E-Commerce) |
| **Skalierbarkeit**                  | Begrenzt durch die Serverkapazität (jede Benutzeranfrage erfordert Serververarbeitung und Ressourcen) | Skaliert besser als SSR, indem die Serverlast mit serverseitiger Interaktivität reduziert wird, aber dennoch auf den Server für dynamische Updates und Socket-Verbindungen für SignalR angewiesen ist | Skaliert sehr gut, da die meisten Verarbeitungen clientseitig erfolgen, was die Serverlast erheblich reduziert | Skaliert gut, insbesondere mit clientseitiger Verarbeitung, nachdem die initiale Seite geladen ist, wodurch die Serverabhängigkeit verringert wird |
| **Offline-Unterstützung**           | Begrenzt (erfordert eine Serververbindung)                        | Begrenzt (abhängig von der Serververbindung für Echtzeit-Interaktionen)     | Volle Unterstützung für clientseitige Verarbeitung mit progressiver Verbesserung  | Anfangs eingeschränkt, dann volle Unterstützung mit clientseitiger progressiver Verbesserung nach dem Übergang.       |

### Entwickler-Fallen: Render-Modus Fallstricke
Manchmal erwarten Entwickler bestimmte Verhaltensweisen, aber die Dinge funktionieren anders. Achten Sie auf diese wichtigen Punkte:

| Feature                    | SSR (Statische Serverseitige Darstellung) | Interaktiv (Server)  | Interaktiv (Client)   |
|----------------------------|-------------------------------------------|----------------------|-----------------------|
| **OnInitializedAsync**      | Einmal aufgerufen                        | Zweimal aufgerufen: einmal während der Vorab-Darstellung und einmal beim Übergang zur Interaktivität | Zweimal aufgerufen: einmal während der Vorab-Darstellung und einmal beim Übergang zur Interaktivität |
| **OnAfterRenderAsync**      | Nicht aufgerufen                         | Sofort nach der Server-Darstellung aufgerufen | Sofort nach der Client-Darstellung aufgerufen |
| **HttpContext Zugriff**     | Vollständig verfügbar während der serverseitigen Vorab-Darstellung | Auf serverseitige Logik beschränkt | Nicht verfügbar |
| **NavigationManager**       | Beschränkt auf serverseitige Navigation   | Vollständig unterstützt für SPA-ähnliches Verhalten | Vollständig unterstützt für SPA-ähnliches Verhalten |
| **JavaScript Interop** | Eingeschränkt (statisches JS möglich, keine dynamische Interop) | Verfügbar nach dem anfänglichen Laden (über SignalR) | Vollständig verfügbar (nach WASM-Laden) | 
| **RenderFragment**          | Nur statisch während SSR                  | Vollständig unterstützt für Seiten- und anwendungsweite Render-Modi | Vollständig unterstützt für Seiten- und anwendungsweite Render-Modi |
| **Fehlerbehandlung**        | Zeigt Fallback-Inhalte oder Fehlerseiten an | Erfordert benutzerdefinierte Fehlergrenzen | Erfordert benutzerdefinierte Fehlergrenzen |
| **DOM-Aufräumaufgaben**     | Möglicherweise benutzerdefinierte Handhabung erforderlich, da das DOM während der Entsorgung möglicherweise nicht existiert | Vollständig unterstützt | Vollständig unterstützt |

**Anmerkung:**
- **Prerendering in interaktiven Modi**: In den Modi **Hybrid** und **Interaktiv (Server)** ist das **serverseitige Prerendering** standardmäßig aktiviert. Das bedeutet, dass die Komponente zuerst serverseitig als statisches HTML gerendert wird. Sobald WebAssembly oder Blazor Server auf der Client-Seite geladen ist, wird die Komponente interaktiv und neu initialisiert. Dies führt dazu, dass **`OnInitializedAsync` zweimal aufgerufen wird**: einmal während des **serverseitigen Prerenderings** und erneut, wenn die App auf der Client-Seite zur Interaktivität übergeht.
 
### Wahl des richtigen Modus - Zusammenfassung
Die Wahl des richtigen Rendering-Modus in Blazor ist eine komplexe Entscheidung, die eine sorgfältige Abwägung verschiedener Faktoren erfordert. Während die Tabellen, die zuvor in diesem Kapitel bereitgestellt wurden, detaillierte Vergleiche zu verschiedenen Aspekten bieten, ist es wichtig zu bedenken, dass es keine „One-Size-Fits-All“-Lösung gibt. Der beste Ansatz besteht häufig darin, eine Kombination von Rendering-Modi zu wählen, die den spezifischen Anforderungen Ihrer Anwendung entspricht. Berücksichtigen Sie Faktoren wie SEO, Leistung und Interaktivitätskomplexität.

Denken Sie daran, dass Blazor Ihnen ermöglicht, Rendering-Modi innerhalb einer einzigen Anwendung zu mischen und anzupassen. Beginnen Sie damit, Ihre Anwendung in Komponenten zu unterteilen und herauszufinden, welche Interaktivität benötigen und welche statisch bleiben können. Dieser Prozess kann eine Iteration erfordern, um das optimale Gleichgewicht zu finden.

#### Beispielanwendungsfälle
| Szenario                      | Empfohlener Modus                    |
|-------------------------------|--------------------------------------|
| Blog- oder Nachrichtenseite    | SSR                                  |
| Echtzeit-Dashboard             | Interaktiv                          |
| E-Commerce-Produktseiten       | SSR für Katalog, Interaktiv für Warenkorb |
| Single-Page-App (SPA)          | Interaktiv                          |
| Hybrid-Anwendung               | Variabel (SSR zu Interaktiv)         |

## Komponenten- und Service-Platzierung
Bei der Entwicklung einer Blazor-Anwendung ist es entscheidend, wo Komponenten und Dienste platziert werden, um optimale Leistung und Sicherheit zu gewährleisten. Die Platzierung dieser Elemente sollte sorgfältig bedacht werden, um sicherzustellen, dass Ihre Anwendung effizient läuft und die erforderlichen Sicherheitsanforderungen erfüllt werden.

### Komponentenplatzierung

Bei der Entscheidung, wo Komponenten in einer Blazor-Anwendung platziert werden sollen, sollte zunächst der ausgewählte Rendering-Modus berücksichtigt werden. Die folgende Tabelle fasst die geeigneten Platzierungen für verschiedene Komponententypen zusammen:

| Komponententyp                | Server  | Client | Shared  |
|-------------------------------|---------|--------|---------|
| **Server-spezifische Logik**   | **Ja**: Auf dem Server platzieren für sichere Verarbeitung und Zugriff auf Server-Ressourcen. | **Nein**: Nicht geeignet für den Client, da es auf Serverlogik angewiesen ist. | **Nein**: Nur im Server-Kontext relevant. |
| **Interaktive UI-Elemente**    | **Ja**: SSR und Interaktive Server-Rendering-Modi. | **Ja**: Interaktives Client und Interaktiver Auto-Modus. | **Ja**: Komponenten ohne Rendering-Modus-Definition. Kann per Instanz definiert werden. |
| **Datenzugriffs-Komponenten**  | **Ja**: Empfohlen für Sicherheit und direkten Zugriff auf Datenbanken. | **Ja (mit Vorsicht)**: Nur verwenden, wenn Daten sicher ohne Offenlegung sensibler Informationen abgerufen werden können. | **Ja**: Kann geteilt werden, wenn es in beiden Modi verwendet wird, jedoch sollten Sicherheitspraktiken beachtet werden. |
| **Authentifizierungs-Komponenten** | **Ja**: Essentiell für das sichere Verwalten von Benutzersitzungen auf dem Server. | **Nein**: Client-seitige Authentifizierung sollte vorsichtig gehandhabt werden, um die Offenlegung sensibler Daten zu vermeiden. | **Begrenzt**: Gemeinsame Komponenten können die Authentifizierung verwalten, sollten jedoch Sicherheit priorisieren. |

**Anmerkung**:
1. **Datenzugriffsstrategie**:
   - Bewerten Sie, wo Ihre Daten gespeichert sind und wie sie abgerufen werden; platzieren Sie Datenzugriffs-Komponenten auf dem Server, wenn Sicherheit Priorität hat.
   - Wenn APIs verwendet werden, prüfen Sie, ob diese APIs sicher vom Client aus zugänglich sind.

2. **Geteilte Logik**:
   - Für Komponenten, die in beiden Umgebungen funktionieren müssen, stellen Sie sicher, dass sie so gestaltet sind, dass sie mit Unterschieden im Ausführungskontext umgehen können (z. B. Zugriff auf Dienste oder APIs).

3. **Statische Komponenten**:
   - Komponenten ohne Rendering-Modus (Standard SSR) und ohne spezifische Dienstverbindung können überall platziert werden.


### Service-Platzierung

Bei der Entwicklung einer Blazor-Anwendung spielt auch die Platzierung und Registrierung von Diensten eine wichtige Rolle.

#### Server-seitige Dienste
Server-seitige Dienste eignen sich hervorragend für die sichere Handhabung sensibler Daten und Geschäftslogik. Diese Dienste sollten immer auf dem Server registriert werden, um die Exposition gegenüber potenziellen Sicherheitslücken zu minimieren. Sie können Aufgaben wie Authentifizierung, Datenzugriff und alle Operationen verwalten, die eine sichere Verarbeitung erfordern.

**Prerendering-Berücksichtigung:** Bei der Verwendung von Prerendering sollten Sie daran denken, dass server-seitige Dienste während der initialen Rendering-Phase verfügbar sind. Client-seitige Dienste hingegen sind zu diesem Zeitpunkt nicht verfügbar, weshalb Sie für Ihre Client-Komponenten die server-seitige Version von Client-Diensten registrieren müssen.

#### Transiente und Scoped Dienste
Transiente und Scoped Dienste können je nach Bedarf entweder auf dem Server oder dem Client registriert werden:

- **Server-Registrierung:** Wenn diese Dienste für Operationen verwendet werden, die Datenzugriff erfordern oder eine sichere Handhabung von Benutzerdaten benötigen, sollten sie auf dem Server registriert werden.
- **Client-Registrierung:** Wenn die Dienste nur für Client-seitige Interaktionen benötigt werden (z. B. UI-Zustandsverwaltung), können sie auf dem Client registriert werden.

Diese Flexibilität ermöglicht es Entwicklern, die Ressourcennutzung zu optimieren und sicherzustellen, dass jeder Dienst dort platziert wird, wo er am effektivsten ist.

#### Singleton-Dienste
Singleton-Dienste sollten idealerweise auf dem Server registriert werden, um eine einzelne Instanz während des gesamten Lebenszyklus der Anwendung aufrechtzuerhalten. Dieser Ansatz gewährleistet ein konsistentes Verhalten über Sitzungen hinweg und reduziert den Overhead, indem er mehrere Instanzen desselben Dienstes vermeidet.

**Client-Betrachtung:** Die Registrierung von Singleton-Diensten auf dem Client wird im Allgemeinen nicht empfohlen, da dies zu Problemen mit der Zustandsverwaltung führen kann. Wenn Sie einen gemeinsamen Zustand in verschiedenen Teilen Ihrer Anwendung benötigen, sollten Sie stattdessen einen server-seitigen Singleton in Betracht ziehen.

#### Singleton-Dienste und Rendering-Übergänge

In Blazor werden **Singleton-Dienste** verwendet, um eine einzige Instanz während des gesamten Lebenszyklus der Anwendung beizubehalten. Sie verhalten sich jedoch unterschiedlich, wenn zwischen verschiedenen Rendering-Modi gewechselt wird, beispielsweise vom serverseitigen Rendering (SSR) zum clientseitigen Rendering (WebAssembly).

- **Während des ersten Renderings:** Wenn eine Blazor-Komponente zum ersten Mal auf dem Server gerendert wird, sind **auf dem Server registrierte Singleton-Dienste** verfügbar. Dies hilft, gemeinsam genutzte Ressourcen wie Authentifizierung oder Protokollierung über verschiedene Komponenten hinweg beizubehalten.

- **Prerendering-Überlegungen:** Wenn Prerendering aktiviert ist, wird die Komponente zunächst auf dem Server gerendert, bevor sie an den Client gesendet wird. Während dieser Phase können **serverseitige Singleton-Dienste** verwendet werden, aber **clientseitige Dienste** sind erst verfügbar, wenn die Seite vollständig auf dem Client geladen ist. Das bedeutet, dass während der frühen Phase einige Dienste möglicherweise nicht zugänglich sind. Sie müssen sicherstellen, dass Ihre App damit umgehen kann, indem Sie sich auf serverseitige Dienste verlassen, bis der Client bereit ist.

- **Übergang zwischen Rendering-Modi:** Beim Wechsel von SSR zu Interactive Server- oder Interactive Client-Modi sind **serverseitige Singleton-Dienste** im gesamten App verfügbar. Wenn jedoch auf clientseitiges Rendering (z. B. Blazor WebAssembly) gewechselt wird, sind diese serverseitigen Dienste nicht mehr direkt zugänglich. Um mit serverseitigen Daten zu interagieren, müssen Sie APIs oder andere Methoden verwenden.

- **Zustandsverwaltung:** Singleton-Dienste können bei der Verwaltung des App-Zustands helfen, aber Sie müssen sicherstellen, dass der Zustand richtig übertragen oder synchronisiert wird, wenn zwischen serverseitigem und clientseitigem Rendering gewechselt wird. Wenn dies nicht richtig gehandhabt wird, kann der Zustand unsynchronisiert werden, was zu Fehlern oder inkonsistentem Verhalten führen kann.

#### Wichtige Überlegungen für Entwickler

- **Skalierbarkeit und Ressourcennutzung:** Bei der Verwendung von Singleton-Diensten in Blazor Server-Anwendungen mit vielen gleichzeitigen Benutzern müssen Entwickler vorsichtig mit der Ressourcennutzung und der Thread-Sicherheit umgehen. Singleton-Dienste werden von allen Benutzersitzungen gemeinsam genutzt, was zu einem erhöhten Speicherverbrauch und potenziellen Leistungsengpässen führen kann.

- **Thread-Sicherheit:** Da mehrere Benutzer gleichzeitig auf denselben Singleton-Dienst zugreifen können, ist es entscheidend, thread-sichere Praktiken zu implementieren, um Dateninkonsistenzen zu vermeiden.

- **Zustandssynchronisation:** Änderungen, die in einem Singleton-Dienst vorgenommen werden, betreffen alle Benutzer. Entwickler sollten Mechanismen implementieren, um sicherzustellen, dass Zustandsänderungen effektiv über verschiedene Benutzersitzungen hinweg kommuniziert werden.

- **Lebenszyklusmanagement:** Singleton-Dienste bleiben während der gesamten Anwendungslaufzeit bestehen. Eine ordnungsgemäße Bereinigung und Ressourcenverwaltung sind notwendig, um zu vermeiden, dass Ressourcen länger als nötig gehalten werden.

## Hilfreiche Links (Alle Links sind auf Englisch)

- [ASP.NET Core Blazor render modes](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes?view=aspnetcore-9.0)
- [Blazor .NET 8 Server-side Rendering (SSR)](https://akifmt.github.io/dotnet/2024-01-16-blazor-.net8-server-side-rendering-ssr/)
- [Everything New in .NET 9: The Ultimate Developer's Guide](https://dev.to/bytehide/everything-new-in-net-9-the-ultimate-developers-guide-331e)
- [Blazor and .NET 8: How I Built a Fast and Flexible Website](https://jeffreyfritz.com/2024/02/blazor-and-net-8-how-i-build-a-fast-and-flexible-website/)
- [Black Belt Blazor - Unterschiede zwischen interaktivem und statischem Blazor](https://github.com/devessenceinc/BlackBeltBlazor)
- [Build your first web app with ASP.NET Core using Blazor](https://dotnet.microsoft.com/en-us/learn/aspnet/blazor-tutorial/intro)
- [Creating A Step-By-Step End-To-End Database Server-Side Blazor Application](https://blazorhelpwebsite.com/ViewBlogPost/34)


## Fazit

Die Auswahl des optimalen Rendering-Modus in Blazor ist eine wichtige Entscheidung, die einen großen Einfluss auf die Performance, die Benutzererfahrung und die langfristige Lebensfähigkeit Ihrer Anwendung hat. Die Wahl zwischen Server-Side Rendering (SSR), Interactive Server, Interactive Client und Auto-Render-Modi ist nicht nur eine technische Überlegung, sondern eine strategische, die sorgfältige Planung und Überlegung erfordert.

![image](/images/posts/blazor-developers/development.png)

Wichtige Punkte, die zu berücksichtigen sind:

1. **Flexibilität ist entscheidend:** Nutzen Sie Blazors Mix-and-Match-Ansatz, um Render-Modi für verschiedene Teile Ihrer Anwendung anzupassen.
2. **Konzentrieren Sie sich auf kritische Komponenten:** Identifizieren und priorisieren Sie wichtige Bereiche Ihrer Anwendung, um die Leistung zu optimieren.
3. **Iterative Verbesserung:** Seien Sie bereit, Ihren Ansatz basierend auf Benutzerfeedback und dem Verhalten der Anwendung zu verfeinern.
4. **Ausgewogenheit der Bedürfnisse:** Abwägen der unmittelbaren Leistungsanforderungen gegen die zukünftige Skalierbarkeit.
5. **Platzierung der Komponenten ist wichtig:** Positionieren Sie Komponenten und Dienste strategisch für optimale Leistung, Sicherheit und Nachfrage.
6. **Benutzerzentriertes Design:** Priorisieren Sie immer das Endbenutzererlebnis in Ihren architektonischen Entscheidungen.
7. **Anpassungsfähigkeit ist unerlässlich:** Seien Sie bereit, Ihre Rendering-Strategien weiterzuentwickeln, wenn Ihre Anwendung wächst.

Durch die Anwendung dieser Prinzipien können Sie reaktionsfähige Webanwendungen erstellen, die aktuelle Anforderungen erfüllen und gleichzeitig für zukünftige Herausforderungen anpassungsfähig bleiben. Ihre Wahl des Render-Modus sollte mit den Zielen Ihrer App übereinstimmen, sei es die Priorisierung von Geschwindigkeit, Interaktivität oder einer Balance aus beidem. Mit sorgfältiger Planung und Blazors flexibler Architektur können Sie leistungsstarke Anwendungen entwickeln, die ein hervorragendes Benutzererlebnis bieten.


## Fazit

Die Wahl des richtigen Render-Modus in Blazor besteht darin, das Gleichgewicht zwischen Leistung, Interaktivität und Wartbarkeit zu finden. Jeder Modus bringt einzigartige Verhaltensweisen und Einschränkungen mit sich, die beeinflussen können, wie Ihre App funktioniert. Zum Beispiel können Lebenszyklusereignisse wie `OnInitializedAsync` je nach Modus mehrmals ausgeführt werden, und der Zugriff auf Funktionen wie `HttpContext` kann je nach Render-Ort variieren. Die Wahl zwischen Server-Side Rendering (SSR), Interaktivem Server, Interaktivem Client und Auto-Render-Modi erfordert sorgfältige Überlegungen und strategische Planung.

![image](/images/posts/blazor-developers/development.png)

**Tipps für den Erfolg:**

- **Bewusstsein für Einschränkungen:** Verstehen Sie, wie jeder Render-Modus Lebenszyklusmethoden, Navigation und Interop beeinflusst, damit Sie Überraschungen vermeiden können.
- **Anpassung an Bedürfnisse:** Verwenden Sie eine Mischung aus Render-Modi, um spezifische Anforderungen in verschiedenen Teilen Ihrer App zu erfüllen.
- **Fokus auf kritische Komponenten:** Identifizieren und priorisieren Sie wichtige Bereiche Ihrer Anwendung, um die Leistung zu optimieren.
- **Optimieren, was zählt:** Konzentrieren Sie sich auf die Verbesserung der kritischen Bereiche, die einen großen Einfluss auf die Leistung und die Benutzererfahrung haben.
- **Iterative Verbesserung:** Seien Sie bereit, Ihren Ansatz zu verfeinern, während Sie Feedback sammeln und daraus lernen, wie Benutzer mit Ihrer Anwendung interagieren.
- **Planung für Wachstum:** Bauen Sie Flexibilität in Ihre Architektur ein, um sich anzupassen, wenn Ihre App skaliert oder sich die Anforderungen ändern.
- **Benutzerorientiertes Denken:** Priorisieren Sie immer ein reibungsloses und intuitives Erlebnis für Ihre Benutzer – sie sind der Grund für die Existenz der App.
- **Bleiben Sie flexibel:** Seien Sie bereit, Ihre Rendering-Strategie zu überdenken, wenn Ihr Projekt wächst oder neue Herausforderungen auftreten.

Blazors Flexibilität ermöglicht es Ihnen, Apps zu erstellen, die gut funktionieren und sich an sich ändernde Bedürfnisse anpassen. Indem Sie diese Prinzipien im Hinterkopf behalten und sorgfältig planen, können Sie die Komplexitäten der Render-Modi souverän meistern und gleichzeitig ein nahtloses, benutzerorientiertes Erlebnis bieten.


<div id="post-nav"></div>
