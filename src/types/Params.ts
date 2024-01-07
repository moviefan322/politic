export default interface IParams {
  country: string;
  candidate: string;
  platform: string;
  keywords: string[];
  negTweetCutoff: number;
  posTweetCutoff: number;
  dateRange: string | null;
  showChart: boolean;
}
