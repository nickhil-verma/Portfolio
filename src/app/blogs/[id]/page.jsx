import { cache } from "react";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { baseBlogs } from "../../../data/baseBlogs";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

// Deduplicate database queries between generateMetadata and Page component
const getBlog = cache(async (id) => {
  let blog = null;
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db("portfolio");
      if (ObjectId.isValid(id)) {
        blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
      }
    }
  } catch (e) {
    console.error("Error fetching blog by ID in getBlog:", e);
  }

  if (!blog) {
    blog = baseBlogs.find(b => b._id === id);
  }

  if (blog) {
    return {
      ...blog,
      _id: blog._id.toString(),
      created_at: blog.created_at ? new Date(blog.created_at).toISOString() : null,
    };
  }

  return null;
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Article Not Found | Developer Insights",
      description: "The insight you are searching for might have been archived or removed."
    };
  }

  return {
    title: `${blog.title} | Developer Insights`,
    description: blog.excerpt || "Nikhil's Insight on AI & NLP, Full Stack Engineering, and Space Tech.",
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.created_at,
      authors: ["Nikhil Verma"],
      images: [
        {
          url: blog.bannerUrl || blog.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.bannerUrl || blog.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"],
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  return (
    <>
      {blog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": blog.title,
              "description": blog.excerpt,
              "image": blog.bannerUrl || blog.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
              "datePublished": blog.created_at || new Date().toISOString(),
              "author": {
                "@type": "Person",
                "name": "Nikhil Verma"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Nikhil Verma",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://nickhil-verma.vercel.app/blogs/${id}`
              }
            })
          }}
        />
      )}
      <BlogDetailClient blog={blog} initialViews={blog?.views || 0} id={id} />
    </>
  );
}
