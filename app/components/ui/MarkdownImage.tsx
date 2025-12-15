export function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        borderRadius: '12px',
        width: '100%',
        height: '500px',
        objectFit: 'cover',
      }}
    />
  );
}
