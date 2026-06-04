import parse, { DOMNode, Element, attributesToProps } from 'html-react-parser';
import Image from 'next/image';

interface HtmlParserProps {
  html: string;
  className?: string;
}

export default function HtmlParser({ html, className }: HtmlParserProps) {
  const options = {
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.name === 'img') {
        const { src, alt, width, height, ...rest } = domNode.attribs;
        
        // Convert string attributes to React props
        const props = attributesToProps(rest);

        return (
          <Image
            src={src}
            alt={alt || 'Image'}
            width={width ? parseInt(width, 10) : 1200}
            height={height ? parseInt(height, 10) : 800}
            style={{ width: '100%', height: 'auto' }}
            {...props}
          />
        );
      }
    }
  };

  return (
    <div className={className}>
      {parse(html, options)}
    </div>
  );
}
