---
title: "Domain-Driven Design for Developers"
date: 2023-10-06
categories: [software-development, architecture]
tags: [ddd, domain-driven-design, architecture, ooad, event-storming]
lang: en
excerpt: "A concise overview of Domain-Driven Design for developers: how DDD differs from OOAD, core vocabulary, onion architecture, and event storming."
---

![cover](~/images/posts/ddd-developers/cover.png)

**[GitHub Repository](https://github.com/AlexNek/ddd-for-developers)**

## Introduction

There is a lot of information about DDD, but it is hard to find a short explanation of what the difference from Object-Oriented Analysis and Design (OOAD) actually is, and what changes developers should expect. This article extracts and collects just the essential pieces from the big mountain of DDD, so that software developers can quickly understand the difference from the most common way of software development.

## When DDD Might Be Useful

There is no big point in using DDD if you have a small project or do not have a significant problem in your current project. Every design approach has advantages and disadvantages, and things look different depending on who is looking at them.

When a **domain expert** sees a room, they see business names and real-world concepts. When a **developer** sees the same space, they see naming in software code — technical terms, data structures, and abstractions. Both people cannot work well together if they use a different language for the same objects. Would it not be better if we spoke a **common language**?

![image](~/images/posts/ddd-developers/room-domain1.png)  
*Pic 1. Business names. (© Michael Plöd)*

![image](~/images/posts/ddd-developers/room-domain2.png)  
*Pic 2. Naming in software code. (© Michael Plöd)*

The same question applies to how we structure our code. Do you remember a common pattern where everything is organized by technical layers — controllers, services, repositories — instead of by business areas? DDD asks us to organize by **business domains**, not by technical convenience.

![image](~/images/posts/ddd-developers/customer1.png)  
*Pic 3. Common object. (© Michael Plöd)*

![image](~/images/posts/ddd-developers/customer2.png)  
*Pic 4. Division according to business areas. (© Michael Plöd)*

## Two Ways of Thinking

Let us compare how we might think about our applications:

### 1. The OOP Way

Our application is a collection of objects. Every object has attributes and methods — operations. Objects and data flow are our main guides. We think about class inheritance, how objects interact, and how data moves through layers.

Typical OOP thinking focuses on:
- **Class hierarchies** — base classes, derived classes, interfaces.
- **Data flow** — how objects pass data between layers.
- **Technical layering** — presentation, business logic, data access.

![image](~/images/posts/ddd-developers/inheritance.png)  
*Pic 5. Class inheritance. (© libretexts.org)*

![image](~/images/posts/ddd-developers/car.png)  
*Pic 6. Class definition and implementation. (© aigents.co)*

![image](~/images/posts/ddd-developers/oop-example.png)  
*Pic 7. OOP example. (© iameans.top)*

![image](~/images/posts/ddd-developers/layered-architecture.png)  
*Pic 8. OOP layers. (© iameans.top)*

### 2. The DDD Way

Our application follows our **business rules**. A person starts an action, we check some rules, and we finish the action. The focus shifts from objects and data to **domain behavior** and **business processes**.

The most well-known picture of DDD architecture is the **Onion Architecture** (also called Clean Architecture or Hexagonal Architecture). The idea is simple:

- The **domain model** is at the center — entities, value objects, domain events.
- **Domain services** and **application services** surround it.
- **Infrastructure** (databases, message queues, external APIs) is at the outermost layer.

![image](~/images/posts/ddd-developers/ddd-layers.png)  
*Pic 9. DDD layers, 2003. (© Eric Evans)*

![image](~/images/posts/ddd-developers/ddd-arch.png)  
*Pic 10. Onion architecture, different view. (© Amichai Mantinband)*

![image](~/images/posts/ddd-developers/onion.png)  
*Pic 11. Onion Architecture. (© Constantin Gustov)*

The key insight: **DDD does not require thinking about objects and data first.** It requires thinking about business rules and processes first. The domain model drives everything else.

## DDD Vocabulary

DDD is not easy to learn — there are many new concepts to understand. Here are the essential definitions, mostly from Eric Evans' work:

![image](~/images/posts/ddd-developers/ddd-pattern.png)  
*Pic 12. Pattern Language Overview. (© Eric Evans)*

- **Domain** — A sphere of knowledge, influence, or activity. The subject area to which the user applies a program is the domain of the software.

  ![image](~/images/posts/ddd-developers/subdomains-cat.png)  
  *Subdomains. (© Michael Plöd)*
- **Model** — A system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.
- **Ubiquitous Language** — A language structured around the domain model and used by all team members within a bounded context. It connects all activities of the team with the software.
- **Context** — The setting in which a word or statement appears that determines its meaning. Statements about a model can only be understood in a context.
- **Bounded Context** — A description of a boundary (typically a subsystem or the work of a particular team) within which a particular model is defined and applicable.
- **Entities** — Objects that represent a thread of continuity and identity, going through a lifecycle, though their attributes may change. An object must be distinguished from other objects even though they might have the same attributes. Mistaken identity can lead to data corruption.
- **Value Objects** — Objects that describe or compute some characteristic of a thing. They have no conceptual identity. When you care only about the attributes and logic of an element of the model, classify it as a value object. Treat the value object as immutable.
- **Domain Events** — Something happened that domain experts care about. A domain event is a full-fledged part of the domain model, a representation of something that happened in the domain. Domain events are ordinarily immutable, as they are a record of something in the past.
- **Services** — When a significant process or transformation in the domain is not a natural responsibility of an entity or value object, add an operation to the model as a standalone interface declared as a service.
- **Modules** — Choose modules that tell the story of the system and contain a cohesive set of concepts. Give the modules names that become part of the ubiquitous language.

  ![image](~/images/posts/ddd-developers/modules.png)  
  *Modules. (© Michael Plöd)*
- **Aggregates** — Cluster the entities and value objects into aggregates and define boundaries around each. Choose one entity to be the root of each aggregate, and allow external objects to hold references to the root only.

  ![image](~/images/posts/ddd-developers/agregate.png)  
  *Aggregate with root entity. (© Thomas Ploch)*
- **Repositories** — Query access to aggregates expressed in the ubiquitous language. For each type of aggregate that needs global access, create a service that can provide the illusion of an in-memory collection of all objects of that aggregate's root type.

## How to Model Business Processes

**Event Storming** is the most popular process modelling technique in the DDD world. The idea is to bring together software developers and domain experts and let them learn from each other. The result is based on repetitive actions taken from the real world.

![image](~/images/posts/ddd-developers/estrming-base.png)  
*Pic 13. Introducing EventStorming. (© Alberto Brandolini)*

![image](~/images/posts/ddd-developers/dl-event-storming.png)  
*Pic 14. Design Level Event Storming. (© Michael Plöd)*

![image](~/images/posts/ddd-developers/es-result.png)  
*Pic 15. Event Storming result by Judith Birmoser. (© Judith Birmoser)*

The most common colors and elements used in Event Storming:

- **Domain Events** — orange
- **Commands** — light blue
- **Aggregates** — yellow
- **Issues** — red or purple
- **User Roles / Personas** — yellow with stick figure
- **Views** — green
- **Bounded Contexts** — solid line, names on pink notes
- **Subdomains** — dashed lines
- **Event Flow** — arrows

Inside the ellipses you typically find a bounded context. The goal is to discover the domain model collaboratively, step by step, by walking through the business process as a sequence of events.

## Learn More

These are some links to get you started with DDD.

### Books

> Note: Reading order is important — 1, 2, 3 (green, red, blue) / (overview, easy to understand, academic explanation).

1. Vaughn Vernon — [*Domain-Driven Design Distilled*](https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon-ebook/dp/B01JJSGE5S) (about 160 pages)

   ![image](~/images/posts/ddd-developers/ddd-book-green.png)

2. Vaughn Vernon — [*Implementing Domain-Driven Design*](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) (about 700 pages)

   ![image](~/images/posts/ddd-developers/ddd-book-red.png)

3. Eric Evans — [*Domain-Driven Design*](https://www.amazon.com/dp/0321125215) (about 450 pages)

   ![image](~/images/posts/ddd-developers/ddd-book-blue.png)

4. Alberto Brandolini — [*Introducing EventStorming*](https://leanpub.com/introducing_eventstorming)

   ![image](~/images/posts/ddd-developers/ddd-book-event-storming.png)

5. Eric Evans — [*DDD Reference*](https://www.domainlanguage.com/ddd/reference/) (Free PDF)

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

- Amichai Mantinband — [*ASP.NET 6 REST API Following CLEAN ARCHITECTURE & DDD Tutorial*](https://www.youtube.com/watch?v=fhM0V2N1GpY&list=PLzYkqgWkHPKBcDIP5gzLfASkQyTdy0t4k) (19 parts)

  ![image](~/images/posts/ddd-developers/vid-am-restapi.png)

- Codewrinkles — [*DDD Fundamentals*](https://www.youtube.com/playlist?list=PL2E-vlKoo_v3ch9oZWYZWwRbqdVoWHY8X) (8 parts)
- Codewrinkles — [*Social Network from Scratch with DDD*](https://www.youtube.com/playlist?list=PL2E-vlKoo_v2AM3Bw_lfVZE_iLW-YS0sE) (5 parts)

  ![image](~/images/posts/ddd-developers/codewrinkles.png)

### Websites

- [Domain-Driven Design Crew](https://github.com/ddd-crew)
- [Free Domain-Driven Design Learning Resources](https://github.com/ddd-crew/free-ddd-learning-resources)
- [Domain Driven Design (DDD) — Awesome Architecture](https://awesome-architecture.com/)
- [Event Storming](https://www.eventstorming.com/)
- [TaskoMask](https://github.com/hamed-shirbandi/TaskoMask) — Real-world open-source project based on .NET 6 with Microservices, DDD, BDD and Testing concepts.


<div id="post-nav"></div>
