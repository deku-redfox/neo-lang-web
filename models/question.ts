export default interface QuestionProps {
  id: number;
  type: 'QCM' | 'QRO';
  response: string;
  format: 'IMG' | 'AUD' | 'TXT';
  content: string;
  parsedContent: {
    txt: string;
    media?: string;
    response: null;
  };
  lesson_id: number;
}
