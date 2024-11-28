import { type Post } from "contentlayer/generated";

export function OgImage({
  title,
  description,
}: Pick<Post, "title" | "description">) {
  return (
    <div
      style={{
        backgroundColor: "#1e1e2e",
        color: "#cdd6f4",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          borderBottom: "4px solid #313244",
        }}
      >
        {title}
      </h1>
      <p style={{ color: "#a6adc8", fontSize: "24px", width: "50%" }}>
        {description}
      </p>
    </div>
  );
}

export function OgImageNotFound() {
  return <p>Post Not Found</p>;
}
