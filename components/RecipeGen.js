import { OpenAI } from 'openai';
import { useState } from 'react';

require('dotenv').config()
console.log("api key: " + process.env.NEXT_PUBLIC_OPENAI_KEY)

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY, dangerouslyAllowBrowser: true});


export default function RecipeGen({items}) {
    

    const [genrecipe, setGenrecipe] = useState("")

    async function generateRecipe(pantryItems) {
        const items = pantryItems.map(item => item.name)
        const prompt = `Here are the items in my pantry: ${items.join(", ")}. Can you suggest a recipe that I can make using these ingredients?`;
        setGenrecipe('Loading...')
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
          });
      
          const recipe = response.choices[0].message.content;
          setGenrecipe(recipe)
        } catch (error) {
          console.error("Error generating recipe:", error);
          return null;
        }
    }
    

    return (
        <div
        class="rounded-lg border bg-card text-card-foreground shadow-sm md:max-w-[600px] lg:max-w-[800px]"
        data-v0-t="card"
        style={{width: 135 + '%', marginLeft: -17.5 + '%'}}
        >
            <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Recipe Generator</h3>
                <p class="text-sm text-muted-foreground">Generate a recipe based on the items in your pantry.</p>
            </div>
            <div class="p-6">
                <form class="grid gap-4">
                <div class="grid gap-2">
                    <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="recipe"
                    >
                    Recipe Output
                    </label>
                    <textarea
                    class="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="recipe"
                    placeholder="Generated recipe will appear here..."
                    readOnly
                    value={genrecipe}
                    />
                </div>
                </form>
            </div>
            <div class="flex items-center p-6">
                <button
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => generateRecipe(items)} // Replace with your function
                >
                Generate
                </button>
            </div>
        </div>
    )
}