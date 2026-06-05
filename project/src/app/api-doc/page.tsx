"use client";

import { useEffect } from "react";

export default function ApiDocPage() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css";
        link.id = "swagger-ui-css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js";
        script.id = "swagger-ui-js";
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            if (window.SwaggerUIBundle) {
                // @ts-ignore
                window.SwaggerUIBundle({
                    url: "/api/docs",
                    dom_id: "#swagger-ui",
                    deepLinking: true,
                    presets: [
                        // @ts-ignore
                        window.SwaggerUIBundle.presets.apis,
                        // @ts-ignore
                        window.SwaggerUIStandalonePreset
                    ],
                    layout: "BaseLayout"
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            const existingLink = document.getElementById("swagger-ui-css");
            if (existingLink) existingLink.remove();
            const existingScript = document.getElementById("swagger-ui-js");
            if (existingScript) existingScript.remove();
        };
    }, []);

    return (
        <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "10px 0" }}>
            <div className="swagger-container">
                <div id="swagger-ui" />
            </div>
        </div>
    );
}
