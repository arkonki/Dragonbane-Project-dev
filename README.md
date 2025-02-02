# Dragonbane Character Manager

This project is a web application built with React, TypeScript, and Tailwind CSS for managing characters, parties, and campaigns in the Dragonbane tabletop role-playing game. It utilizes Supabase for backend services, including database, authentication, and real-time updates.

## Features

*   **Character Management:**
    *   Create and manage multiple characters.
    *   Track character attributes, skills, spells, equipment, and appearance.
    *   Calculate derived stats like damage bonus and movement.
    *   Handle experience and level advancement.
*   **Party Management:**
    *   Create and manage adventure parties.
    *   Add and remove characters from parties.
    *   Share party notes and inventory.
*   **Compendium:**
    *   Browse and search a compendium of game rules, items, spells, and monsters.
    *   Admins can create and edit compendium entries using a Markdown editor.
    *   Supports custom templates for different entry types.
*   **Authentication:**
    *   Secure user authentication using Supabase Auth.
    *   Role-based access control (player, DM, admin).
    *   Password reset functionality.
    *   Email verification (requires SMTP configuration).
*   **Real-time Updates:**
    *   Leverages Supabase Realtime for instant updates across clients.
*   **Dice Roller:**
    *   In-app dice roller for quick and easy dice rolls.
*   **Responsive Design:**
    *   Adapts to different screen sizes for optimal viewing on desktop and mobile devices.
*   **Error Handling:**
    *   Robust error handling and user-friendly error messages.
*   **Rate Limiting:**
    *   Prevents abuse with rate limiting for authentication and email sending.
*   **Session Management:**
    *   Secure session handling with automatic refresh and timeout.

## Tech Stack

*   **Frontend:**
    *   React (with TypeScript)
    *   Vite
    *   Tailwind CSS
    *   Lucide React (icons)
    *   Zustand (state management)
    *   React Router
    *   React Markdown
    *   Remark GFM
    *   Rehype Raw
    *   Rehype Sanitize
*   **Backend:**
    *   Supabase (PostgreSQL database, authentication, real-time)
*   **Other:**
    *   TypeScript
    *   ESLint
    *   Prettier
    *   NPM

## Prerequisites

*   Node.js (version 18 or later)
*   NPM (version 8 or later)
*   A Supabase account and project

## Setup

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Supabase:**
    *   Create a `.env` file in the root directory of the project.
    *   Add your Supabase project URL and anon key to the `.env` file:

        ```
        VITE_SUPABASE_URL=your_supabase_url
        VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
        ```

    *   Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

4. **Run database migrations:**
    *   Make sure you have the Supabase CLI installed.
    *   Run the following command to apply the database migrations:

        ```bash
        npx supabase db push
        ```

5. **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the Vite development server and open the application in your default browser.

## Project Structure




## Environment Variables

The following environment variables need to be set in your `.env` file:

*   `VITE_SUPABASE_URL`: Your Supabase project URL.
*   `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anonymous key.

## Deployment

To deploy the application, you can use any hosting provider that supports Node.js applications. You will need to:

1. Build the production bundle:

    ```bash
    npm run build
    ```

2. Set the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) on your hosting platform.
3. Deploy the `dist` directory to your server.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear messages.
4. Open a pull request against the `main` branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (You'll need to create a LICENSE file if you want to specify a license.)

## Acknowledgements

*   Supabase
*   React
*   Vite
*   Tailwind CSS
*   Lucide React
*   Zod

---

**Remember to:**

*   Replace `<repository-url>` with the actual URL of your repository.
*   Create a `LICENSE` file if you want to specify a license for your project.
*   Fill in any missing details or customize the README further to match your project's specific requirements.

This comprehensive `README.md` file will provide a solid foundation for your Dragonbane Character Manager project, helping users and developers understand, set up, and contribute to your application.
