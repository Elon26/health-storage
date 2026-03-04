type Subtitle = {
  subtitle: string;
  handler: (() => void) | null;
  link: string | null;
};

export default Subtitle;
