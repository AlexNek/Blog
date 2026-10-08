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

Dieselbe Frage gilt für die Strukturierung unseres Codes. Kennnt man das übliche Muster, bei dem alles nach technischen Schichten organisiert ist — Controller, Services, Repositories — anstatt nach Geschäftsbereichen? DDD fordert uns auf, nach **Geschäftsdomänen** zu organisieren, nicht nach technischer Bequemlichkeit.

## Zwei Denkweisen

Vergleichen wir, wie wir über unsere Anwendungen denken können:

### 1. Der OOP-Weg

Unsere Anwendung ist eine Sammlung von Objekten. Jedes Objekt hat Attribute und Methoden — Operationen. Objekte und Datenfluss sind unsere Hauptleitfäden. Wir denken über Klassenvererbung nach, wie Objekte interagieren und wie Daten durch Schichten fließen.

Typisches OOP-Denken konzentriert sich auf:
- **Klassenhierarchien** — Basisklassen, abgeleitete Klassen, Schnittstellen.
- **Datenfluss** — wie Objekte Daten zwischen Schichten weitergeben.
- **Technische Schichtung** — Präsentation, Geschäftslogik, Datenzugriff.

### 2. Der DDD-Weg

Unsere Anwendung folgt unseren **Geschäftsregeln**. Eine Person startet eine Aktion, wir prüfen einige Regeln und schließen die Aktion ab. Der Fokus verlagert sich von Objekten und Daten zu **Domänenverhalten** und **Geschäftsprozessen**.

Das bekannteste Bild der DDD-Architektur ist die **Onion-Architektur** (auch Clean Architecture oder Hexagonale Architektur genannt). Die Idee ist einfach:

- Das **Domänenmodell** steht im Zentrum — Entitäten, Wertobjekte, Domänenereignisse.
- **Domänendienste** und **Anwendungsdienste** umgeben es.
- **Infrastruktur** (Datenbanken, Nachrichtenwarteschlangen, externe APIs) befindet sich in der äußersten Schicht.

Die wichtigste Erkenntnis: **DDD erfordert nicht, zuerst über Objekte und Daten nachzudenken.** Es erfordert, zuerst über Geschäftsregeln und Prozesse nachzudenken. Das Domänenmodell treibt alles andere an.

## DDD-Vokabular

DDD ist nicht einfach zu erlernen — es gibt viele neue Konzepte zu verstehen. Hier sind die wesentlichen Definitionen, hauptsächlich aus Eric Evans' Werk:

- **Domäne** — Eine Wissens-, Einfluss- oder Aktivitätssphäre. Das Fachgebiet, auf das ein Benutzer ein Programm anwendet, ist die Domäne der Software.
- **Modell** — Ein System von Abstraktionen, das ausgewählte Aspekte einer Domäne beschreibt und zur Lösung von Problemen in dieser Domäne verwendet werden kann.
- **Allgegenwärtige Sprache** — Eine Sprache, die um das Domänenmodell herum strukturiert ist und von allen Teammitgliedern innerhalb eines begrenzten Kontexts verwendet wird. Sie verbindet alle Aktivitäten des Teams mit der Software.
- **Kontext** — Der Rahmen, in dem ein Wort oder eine Aussage erscheint und der ihre Bedeutung bestimmt. Aussagen über ein Modell können nur in einem Kontext verstanden werden.
- **Begrenzter Kontext** — Eine Beschreibung einer Grenze (typischerweise eines Subsystems oder der Arbeit eines bestimmten Teams), innerhalb derer ein bestimmtes Modell definiert und anwendbar ist.
- **Entitäten** — Objekte, die einen Faden der Kontinuität und Identität darstellen, der einen Lebenszyklus durchläuft, obwohl sich ihre Attribute ändern können. Ein Objekt muss von anderen Objekten unterschieden werden können, auch wenn es dieselben Attribute hat. Verwechslungen können zu Datenbeschädigung führen.
- **Wertobjekte** — Objekte, die eine Eigenschaft eines Dinges beschreiben oder berechnen. Sie haben keine konzeptionelle Identität. Wenn man sich nur für die Attribute und die Logik eines Modells interessiert, klassifiziert man es als Wertobjekt. Behandeln Sie das Wertobjekt als unveränderlich.
- **Domänenereignisse** — Etwas ist passiert, das Domänenexperten interessiert. Ein Domänenereignis ist ein vollwertiger Teil des Domänenmodells, eine Darstellung dessen, was in der Domäne passiert ist. Domänenereignisse sind in der Regel unveränderlich, da sie eine Aufzeichnung von etwas in der Vergangenheit sind.
- **Dienste** — Wenn ein bedeutender Prozess oder eine bedeutende Transformation in der Domäne keine natürliche Verantwortung einer Entität oder eines Wertobjekts ist, fügen Sie dem Modell eine Operation als eigenständige Schnittstelle hinzu, die als Dienst deklariert wird.
- **Module** — Wählen Sie Module, die die Geschichte des Systems erzählen und einen zusammenhängenden Satz von Konzepten enthalten. Geben Sie den Modulen Namen, die Teil der allgegenwärtigen Sprache werden.
- **Aggregate** — Clustern Sie die Entitäten und Wertobjekte in Aggregaten und definieren Sie Grenzen um jedes. Wählen Sie eine Entität als Wurzel jedes Aggregats und erlauben Sie externen Objekten nur, Verweise auf die Wurzel zu halten.
- **Repositories** — Abfragezugriff auf Aggregate, ausgedrückt in der allgegenwärtigen Sprache. Für jeden Aggregattyp, der globalen Zugriff benötigt, erstellen Sie einen Dienst, der die Illusion einer In-Memory-Sammlung aller Objekte dieses Aggregatwurzeltyps bieten kann.

## Wie man Geschäftsprozesse modelliert

**Event Storming** ist die beliebteste Prozessmodellierungstechnik in der DDD-Welt. Die Idee ist, Softwareentwickler und Domänenexperten zusammenzubringen und sie voneinander lernen zu lassen. Das Ergebnis basiert auf wiederholten Aktionen aus der realen Welt.

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

1. Vaughn Vernon — *Domain-Driven Design Distilled* (ca. 160 Seiten)
2. Vaughn Vernon — *Implementing Domain-Driven Design* (ca. 700 Seiten)
3. Eric Evans — *Domain-Driven Design* (ca. 450 Seiten)
4. Alberto Brandolini — *Introducing EventStorming*
5. Eric Evans — *DDD Reference* (Kostenloses PDF)

### Videos

- Eric Evans — *What is DDD* (DDD Europe 2019)
- Eric Evans — *Bounded Contexts* (DDD Europe 2020)
- Vaughn Vernon — *Microservices and Domain Driven Design* (Munich 2017)
- Vaughn Vernon — *How to Use Aggregates for Tactical Design*
- Alberto Brandolini — *Event Storming* (DDD Europe 2019)
- Michael Plöd — *Introduction to Context Mapping* (DDD Europe 2022)
- Amichai Mantinband — *ASP.NET 6 REST API Following CLEAN ARCHITECTURE & DDD Tutorial* (19 Teile)
- Codewrinkles — *DDD Fundamentals* (8 Teile)
- Codewrinkles — *Social Network from Scratch with DDD* (5 Teile)

### Webseiten

- [Domain-Driven Design Crew](https://dddcrew.com/)
- [Free Domain-Driven Design Learning Resources](https://github.com/mariuszgil/awesome-ddd)
- [Domain Driven Design (DDD) — Domain Centric](https://dddcommunity.io/)
- [Event Storming](https://www.eventstorming.com/)
- [TaskoMask](https://github.com/hassanmonfa/TaskoMask) — Realweltliches Open-Source-Projekt basierend auf .NET 6 mit Microservices, DDD, BDD und Testing-Konzepten.


<div id="post-nav"></div>
