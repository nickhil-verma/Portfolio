import BlogsClient from "./BlogsClient";
import clientPromise from "../../lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blogs | Nikhil's Insights",
  description: "Developer insights, AI chatbot pipelines, frontend performance scaling, and modern developer tooling.",
  openGraph: {
    title: "Blogs | Nikhil's Insights",
    description: "Developer insights, AI chatbot pipelines, frontend performance scaling, and modern developer tooling.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        width: 1200,
        height: 630,
        alt: "Blogs | Nikhil's Insights",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | Nikhil's Insights",
    description: "Developer insights, AI chatbot pipelines, frontend performance scaling, and modern developer tooling.",
    images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97"],
  }
};

export default async function BlogsPage() {
  let fetchedBlogs = [];
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db("portfolio");
      const blogs = await db
        .collection("blogs")
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      
      // Convert MongoDB specific types to JSON-serializable types
      fetchedBlogs = blogs.map(blog => ({
        ...blog,
        _id: blog._id.toString(),
        created_at: blog.created_at ? new Date(blog.created_at).toISOString() : null,
      }));
    }
  } catch (error) {
    console.error("Error fetching blogs server-side:", error);
  }

  return <BlogsClient initialBlogs={fetchedBlogs} />;
}
