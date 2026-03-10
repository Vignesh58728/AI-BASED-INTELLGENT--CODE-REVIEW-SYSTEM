export const fetchAiBackground = async (): Promise<string | null> => {
  try {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) return null;

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=white,minimal,coding,programming,light,bright,white-background,code-editor,macbook,workspace&client_id=${accessKey}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error("Unsplash Error:", error);
    return null;
  }
};
