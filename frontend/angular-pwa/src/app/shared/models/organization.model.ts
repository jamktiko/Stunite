export interface Organizer {
  id: number;
  organizerRegistration: {
    email: string;
    contactPerson: {
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
  organizationPublicInfo: {
    name: string;
    customerServiceEmail: string;
    phone: string;
    website: string;
    description: string;
    address: {
      street: string;
      postalCode: string;
      city: string;
    };
  };
  organizationAdditionalInfo: {
    officialName: string;
    organizationType: string;
    registrationNumber: string;
    billingAddress: {
      street: string;
      postalCode: string;
      city: string;
    };
    invoiceAddress: string;
  };
}
