---
title: "Domain-Driven Design für Entwickler"
date: 2025-10-08
categories: [softwareentwicklung, architektur]
tags: [ddd, domain-driven-design, architektur, ooad, event-storming]
lang: de
excerpt: "Ein kompakter Überblick über Domain-Driven Design für Entwickler: Wie sich DDD von OOAD unterscheidet, Kernbegriffe, Onion-Architektur und Event Storming."
---

![cover](~/images/posts/ddd-developers/cover.png)

**[GitHub-Repository](https://github.com/AlexNek/ddd-for-developers)**

## Einführung

Es gibt viele Informationen über DDD, aber es ist schwer, eine kurze Erklärung zu finden, was der Unterschied zur objektorientierten Analyse und Design (OOAD) tatsächlich ist und welche Änderungen Entwickler erwarten sollten. Dieser Artikel extrahiert und sammelt nur die wesentlichen Stücke aus dem großen Berg von DDD, damit Softwareentwickler schnell den Unterschied zur gängigsten Art der Softwareentwicklung verstehen können.

## Wann DDD nützlich sein kann

Es hat keinen großen Sinn, DDD zu verwenden, wenn man ein kleines Projekt hat oder kein bedeutendes Problem im aktuellen Projekt. Jeder Designansatz hat Vor- und Nachteile, und die Dinge sehen je nach Betrachter unterschiedlich aus.

Wenn ein **Fachexperte** einen Raum sieht, sieht er Geschäftsnamen und reale Konzepte. Wenn ein **Entwickler** denselben Raum sieht, sieht er Benennungen im Softwarecode — technische Begriffe, Datenstrukturen und Abstraktionen. Beide Menschen können nicht gut zusammenarbeiten, wenn sie eine unterschiedliche Sprache für dieselben Objekte verwenden. Wäre es nicht besser, wenn wir eine **gemeinsame Sprache** sprechen würden?

![image](~/images/posts/ddd-developers/room-domain1.png)  
*Pic 1. Geschäftsnamen. (© Michael Plöd)*

![image](~/images/posts/ddd-developers/room-domain2.png)  
*Pic 2. Benennungen im Softwarecode. (© Michael Plöd)*

Dieselbe Frage gilt für die Strukturierung unseres Codes. Kennnt man das übliche Muster, bei dem alles nach technischen Schichten organisiert ist — Controller, Services, Repositories — anstatt nach Geschäftsbereichen? DDD fordert uns auf, nach **Geschäftsdomänen** zu organisieren, nicht nach technischer Bequemlichkeit.

![image](~/images/posts/ddd-developers/customer1.png)  
*Pic 3. Übliches Objekt. (© Michael Plöd)*

![image](~/images/posts/ddd-developers/customer2.png)  
*Pic 4. Aufteilung nach Geschäftsbereichen. (© Michael Plöd)*

## Zwei Denkweisen

Vergleichen wir, wie wir über unsere Anwendungen denken können:

### 1. Der OOP-Weg

Unsere Anwendung ist eine Sammlung von Objekten. Jedes Objekt hat Attribute und Methoden — Operationen. Objekte und Datenfluss sind unsere Hauptleitfäden. Wir denken über Klassenvererbung nach, wie Objekte interagieren und wie Daten durch Schichten fließen.

Typisches OOP-Denken konzentriert sich auf:
- **Klassenhierarchien** — Basisklassen, abgeleitete Klassen, Schnittstellen.
- **Datenfluss** — wie Objekte Daten zwischen Schichten weitergeben.
- **Technische Schichtung** — Präsentation, Geschäftslogik, Datenzugriff.

![image](~/images/posts/ddd-developers/inheritance.png)  
*Pic 5. Klassenvererbung. (© libretexts.org)*

![image](~/images/posts/ddd-developers/car.png)  
*Pic 6. Klassendefinition und Implementierung. (© aigents.co)*

![image](~/images/posts/ddd-developers/oop-example.png)  
*Pic 7. OOP-Beispiel. (© iameans.top)*

![image](~/images/posts/ddd-developers/layered-architecture.png)  
*Pic 8. OOP-Schichten. (© iameans.top)*

### 2. Der DDD-Weg

Unsere Anwendung folgt unseren **Geschäftsregeln**. Eine Person startet eine Aktion, wir prüfen einige Regeln und schließen die Aktion ab. Der Fokus verlagert sich von Objekten und Daten zu **Domänenverhalten** und **Geschäftsprozessen**.

Das bekannteste Bild der DDD-Architektur ist die **Onion-Architektur** (auch Clean Architecture oder Hexagonale Architektur genannt). Die Idee ist einfach:

- Das **Domänenmodell** steht im Zentrum — Entitäten, Wertobjekte, Domänenereignisse.
- **Domänendienste** und **Anwendungsdienste** umgeben es.
- **Infrastruktur** (Datenbanken, Nachrichtenwarteschlangen, externe APIs) befindet sich in der äußersten Schicht.

![image](~/images/posts/ddd-developers/ddd-layers.png)  
*Pic 9. DDD-Schichten, 2003. (© Eric Evans)*

![image](~/images/posts/ddd-developers/ddd-arch.png)  
*Pic 10. Onion-Architektur, andere Ansicht. (© Amichai Mantinband)*

![image](~/images/posts/ddd-developers/onion.png)  
*Pic 11. Onion-Architektur. (© Constantin Gustov)*

Die wichtigste Erkenntnis: **DDD erfordert nicht, zuerst über Objekte und Daten nachzudenken.** Es erfordert, zuerst über Geschäftsregeln und Prozesse nachzudenken. Das Domänenmodell treibt alles andere an.

## DDD-Vokabular

DDD ist nicht einfach zu erlernen — es gibt viele neue Konzepte zu verstehen. Hier sind die wesentlichen Definitionen, hauptsächlich aus Eric Evans' Werk:

![image](~/images/posts/ddd-developers/ddd-pattern.png)  
*Pic 12. Überblick über die Pattern Language. (© Eric Evans)*

- **Domäne** — Eine Wissens-, Einfluss- oder Aktivitätssphäre. Das Fachgebiet, auf das ein Benutzer ein Programm anwendet, ist die Domäne der Software.

  ![image](~/images/posts/ddd-developers/subdomains-cat.png)  
  *Subdomänen. (© Michael Plöd)*
- **Modell** — Ein System von Abstraktionen, das ausgewählte Aspekte einer Domäne beschreibt und zur Lösung von Problemen in dieser Domäne verwendet werden kann.
- **Allgegenwärtige Sprache** — Eine Sprache, die um das Domänenmodell herum strukturiert ist und von allen Teammitgliedern innerhalb eines begrenzten Kontexts verwendet wird. Sie verbindet alle Aktivitäten des Teams mit der Software.
- **Kontext** — Der Rahmen, in dem ein Wort oder eine Aussage erscheint und der ihre Bedeutung bestimmt. Aussagen über ein Modell können nur in einem Kontext verstanden werden.
- **Begrenzter Kontext** — Eine Beschreibung einer Grenze (typischerweise eines Subsystems oder der Arbeit eines bestimmten Teams), innerhalb derer ein bestimmtes Modell definiert und anwendbar ist.
- **Entitäten** — Objekte, die einen Faden der Kontinuität und Identität darstellen, der einen Lebenszyklus durchläuft, obwohl sich ihre Attribute ändern können. Ein Objekt muss von anderen Objekten unterschieden werden können, auch wenn es dieselben Attribute hat. Verwechslungen können zu Datenbeschädigung führen.
- **Wertobjekte** — Objekte, die eine Eigenschaft eines Dinges beschreiben oder berechnen. Sie haben keine konzeptionelle Identität. Wenn man sich nur für die Attribute und die Logik eines Modells interessiert, klassifiziert man es als Wertobjekt. Behandeln Sie das Wertobjekt als unveränderlich.
- **Domänenereignisse** — Etwas ist passiert, das Domänenexperten interessiert. Ein Domänenereignis ist ein vollwertiger Teil des Domänenmodells, eine Darstellung dessen, was in der Domäne passiert ist. Domänenereignisse sind in der Regel unveränderlich, da sie eine Aufzeichnung von etwas in der Vergangenheit sind.
- **Dienste** — Wenn ein bedeutender Prozess oder eine bedeutende Transformation in der Domäne keine natürliche Verantwortung einer Entität oder eines Wertobjekts ist, fügen Sie dem Modell eine Operation als eigenständige Schnittstelle hinzu, die als Dienst deklariert wird.
- **Module** — Wählen Sie Module, die die Geschichte des Systems erzählen und einen zusammenhängenden Satz von Konzepten enthalten. Geben Sie den Modulen Namen, die Teil der allgegenwärtigen Sprache werden.

  ![image](~/images/posts/ddd-developers/modules.png)  
  *Module. (© Michael Plöd)*
- **Aggregate** — Clustern Sie die Entitäten und Wertobjekte in Aggregaten und definieren Sie Grenzen um jedes. Wählen Sie eine Entität als Wurzel jedes Aggregats und erlauben Sie externen Objekten nur, Verweise auf die Wurzel zu halten.

  ![image](~/images/posts/ddd-developers/agregate.png)  
  *Aggregate mit Wurzel-Entität. (© Thomas Ploch)*
- **Repositories** — Abfragezugriff auf Aggregate, ausgedrückt in der allgegenwärtigen Sprache. Für jeden Aggregattyp, der globalen Zugriff benötigt, erstellen Sie einen Dienst, der die Illusion einer In-Memory-Sammlung aller Objekte dieses Aggregatwurzeltyps bieten kann.

## Wie man Geschäftsprozesse modelliert

**Event Storming** ist die beliebteste Prozessmodellierungstechnik in der DDD-Welt. Die Idee ist, Softwareentwickler und Domänenexperten zusammenzubringen und sie voneinander lernen zu lassen. Das Ergebnis basiert auf wiederholten Aktionen aus der realen Welt.

![image](~/images/posts/ddd-developers/estrming-base.png)  
*Pic 13. Introducing EventStorming. (© Alberto Brandolini)*

![image](~/images/posts/ddd-developers/dl-event-storming.png)  
*Pic 14. Design Level Event Storming. (© Michael Plöd)*

![image](~/images/posts/ddd-developers/es-result.png)  
*Pic 15. Event Storming Ergebnis von Judith Birmoser. (© Judith Birmoser)*

Die häufigsten Farben und Elemente beim Event Storming:

- **Domänenereignisse** — orange
- **Befehle** — hellblau
- **Aggregate** — gelb
- **Probleme** — rot oder lila
- **Benutzerrollen / Personas** — gelb mit Strichmännchen
- **Ansichten** — grün
- **Begrenzte Kontexte** — durchgezogene Linie, Namen auf rosa Zetteln
- **Subdomänen** — gestrichelte Linien
- **Ereignisfluss** — Pfeile

Innerhalb der Ellipsen findet man typischerweise einen begrenzten Kontext. Das Ziel ist es, das Domänenmodell kollaborativ zu entdecken, Schritt für Schritt, indem man den Geschäftsprozess als Abfolge von Ereignissen durchgeht.

## Mehr erfahren

Hier sind einige Links, um mit DDD zu beginnen.

### Bücher

> Hinweis: Die Lesereihenfolge ist wichtig — 1, 2, 3 (grün, rot, blau) / (Überblick, leicht verständlich, akademische Erklärung).

1. Vaughn Vernon — [*Domain-Driven Design Distilled*](https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon-ebook/dp/B01JJSGE5S) (ca. 160 Seiten)

   ![image](~/images/posts/ddd-developers/ddd-book-green.png)

2. Vaughn Vernon — [*Implementing Domain-Driven Design*](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) (ca. 700 Seiten)

   ![image](~/images/posts/ddd-developers/ddd-book-red.png)

3. Eric Evans — [*Domain-Driven Design*](https://www.amazon.com/dp/0321125215) (ca. 450 Seiten)

   ![image](~/images/posts/ddd-developers/ddd-book-blue.png)

4. Alberto Brandolini — [*Introducing EventStorming*](https://leanpub.com/introducing_eventstorming)

   ![image](~/images/posts/ddd-developers/ddd-book-event-storming.png)

5. Eric Evans — [*DDD Reference*](https://www.domainlanguage.com/ddd/reference/) (Kostenloses PDF)

### Videos

- Eric Evans — [*What is DDD*](https://www.youtube.com/watch?v=pMuiVlnGqjk) (DDD Europe 2019)

  ![image](~/images/posts/ddd-developers/vid-EricEvans.png)

- Eric Evans — [*Bounded Contexts*](https://www.youtube.com/watch?v=am-HXycfalo) (DDD Europe 2020)

  ![image](~/images/posts/ddd-developers/vid-EricEvans02.png)

- Vaughn Vernon — [*Microservices and Domain Driven Design*](https://www.youtube.com/watch?v=3o4_FWk6JOQ) (Munich 2017)

  ![image](~/images/posts/ddd-developers/vid-VaughnVernon02.png)

- Vaughn Vernon — [*How to Use Aggregates for Tactical Design*](https://www.youtube.com/watch?v=Xf_aLAK1RfE)

  ![image](~/images/posts/ddd-developers/vid-VaughnVernon-aggregates.png)

- Alberto Brandolini — [*Event Storming*](https://www.youtube.com/watch?v=mLXQIYEwK24) (DDD Europe 2019)

  ![image](~/images/posts/ddd-developers/vid-AlbertoBrandolini.png)

- Michael Plöd — [*Introduction to Context Mapping*](https://www.youtube.com/watch?v=k5i4sP9q2Lk) (DDD Europe 2022)

  ![image](~/images/posts/ddd-developers/vid-MichaelPloed.png)

- Amichai Mantinband — [*ASP.NET 6 REST API Following CLEAN ARCHITECTURE & DDD Tutorial*](https://www.youtube.com/watch?v=fhM0V2N1GpY&list=PLzYkqgWkHPKBcDIP5gzLfASkQyTdy0t4k) (19 Teile)

  ![image](~/images/posts/ddd-developers/vid-am-restapi.png)

- Codewrinkles — [*DDD Fundamentals*](https://www.youtube.com/playlist?list=PL2E-vlKoo_v3ch9oZWYZWwRbqdVoWHY8X) (8 Teile)
- Codewrinkles — [*Social Network from Scratch with DDD*](https://www.youtube.com/playlist?list=PL2E-vlKoo_v2AM3Bw_lfVZE_iLW-YS0sE) (5 Teile)

  ![image](~/images/posts/ddd-developers/codewrinkles.png)

### Webseiten

- [Domain-Driven Design Crew](https://github.com/ddd-crew)
- [Free Domain-Driven Design Learning Resources](https://github.com/ddd-crew/free-ddd-learning-resources)
- [Domain Driven Design (DDD) — Awesome Architecture](https://awesome-architecture.com/)
- [Event Storming](https://www.eventstorming.com/)
- [TaskoMask](https://github.com/hamed-shirbandi/TaskoMask) — Realweltliches Open-Source-Projekt basierend auf .NET 6 mit Microservices, DDD, BDD und Testing-Konzepten.


<div id="post-nav"></div>
