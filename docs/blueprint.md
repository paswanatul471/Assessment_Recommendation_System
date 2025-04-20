# **App Name**: AssessAI Advisor

## Core Features:

- Input Interface: Input field for natural language query or job description text.
- URL Input: Input field for job description URL.
- Assessment Recommendation: AI-powered assessment recommendation engine to process input and suggest relevant assessments from SHL's catalog. The AI tool will incorporate the attributes of each assesment.
- Results Table: Display the top 10 assessment recommendations in a tabular format with columns for Assessment Name (linked to SHL catalog), Remote Testing Support (Yes/No), Adaptive/IRT Support (Yes/No), Duration, and Test Type.
- No Results Message: Display an error message if no assessments are found for the query.

## Style Guidelines:

- Primary color: Use a professional blue (#007BFF) for the header and main sections.
- Secondary color: Light gray (#F8F9FA) for backgrounds and card sections to provide contrast.
- Accent: Teal (#20C997) for interactive elements and highlights.
- Clean and readable typography for forms and data tables.
- Use clear and simple icons to represent different assessment types.
- A clean, intuitive layout with a prominent input field at the top, followed by the results table.

## Original User Request:
Gen AI Task: Build an SHL Assessment Recommendation System Problem Overview Hiring managers often struggle to find the right assessments for the roles that they are hiring for. The current system relies on keyword searches and filters, making the process time-consuming and inefficient. Your task is to build an intelligent recommendation system that simplifies this process. Given a natural language query or a job description text or URL, your application should return a list of relevant SHL assessments. You can take a look at the data sources that you are going to work with here, 
Your Task Design and develop a web application that: 1. 2. 3. Takes a given natural language query or job description text URL Recommends at most 10 (min 1) most relevant Individual test solutions from here in the tabular format Each recommendation needs to have at least the following attributes – – – Assessment name and URL (linked to SHL’s catalog) Remote Testing Support (Yes/No) and Adaptive/IRT Support (Yes/No) Duration and Test type
  