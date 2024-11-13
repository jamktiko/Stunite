export interface Event {
  _id: string;
  eventName: string;
  date: string;
  startingTime: string;
  endingTime: string;
  endingDate: string;
  venue: string;
  city: string;
  address: string;
  ticketprice: {
    minticketprice: number;
    maxticketprice: number;
  };
  theme: string;
  isFavorite: boolean;
  details: string;
  imageUrl: string;
  ticketLink: string;
  ticketSaleStart: string;
  ticketSaleEnd: string;
  publishDateTime: string;
  status: string;
  organizerId: string;
  organizationName: string;
  eventTags: string[];
}
