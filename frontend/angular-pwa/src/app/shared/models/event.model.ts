export interface Event {
  _id: string;
  eventName: string;
  date: string;
  startingTime: string;
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
  // organizer?: string;
}
