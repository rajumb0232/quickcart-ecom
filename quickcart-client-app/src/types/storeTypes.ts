
export interface StoreRequest {
    name: string;
    location: string;
    contact_number: string;
    email: string;
    about: string;
}

export interface StoreDetails {
    store_id: string;
    name: string;
    location: string;
    contact_number: string;
    email: string;
    about: string;
    created_date: string;
    last_modified_date: string;
}