export type AccountType = 'renter' | 'landlord' | 'administrator'
export type ListingStatus = 'pending' | 'verified' | 'rejected'
export type NoiseLevel = 'quiet' | 'moderate' | 'lively'
export type VerificationAction = 'approved' | 'rejected'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          account_type: AccountType
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          account_type: AccountType
          created_at?: string
          last_login?: string | null
        }
        Update: {
          email?: string
          full_name?: string
          account_type?: AccountType
          last_login?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          landlord_id: string
          title: string
          description: string
          address: string
          area: string
          city: string
          country: string
          price_per_month: number
          bedrooms: number
          bathrooms: number
          size_sqft: number | null
          property_type: string
          listing_status: ListingStatus
          safety_score: number
          noise_level: NoiseLevel
          commute_rating: number
          lifestyle_tags: string[]
          area_insight: string | null
          verified_at: string | null
          verified_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          landlord_id: string
          title: string
          description: string
          address: string
          area: string
          city: string
          country?: string
          price_per_month: number
          bedrooms: number
          bathrooms: number
          size_sqft?: number | null
          property_type: string
          listing_status?: ListingStatus
          safety_score?: number
          noise_level?: NoiseLevel
          commute_rating?: number
          lifestyle_tags?: string[]
          area_insight?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          title?: string
          description?: string
          address?: string
          area?: string
          city?: string
          country?: string
          price_per_month?: number
          bedrooms?: number
          bathrooms?: number
          size_sqft?: number | null
          property_type?: string
          listing_status?: ListingStatus
          safety_score?: number
          noise_level?: NoiseLevel
          commute_rating?: number
          lifestyle_tags?: string[]
          area_insight?: string | null
          verified_at?: string | null
          verified_by?: string | null
          updated_at?: string
        }
      }
      landlords: {
        Row: {
          user_id: string
          business_name: string | null
          phone_number: string | null
          response_rate: number
          trust_score: number
          total_listings: number
          verified_listings_count: number
          member_since: string
        }
        Insert: {
          user_id: string
          business_name?: string | null
          phone_number?: string | null
          response_rate?: number
          trust_score?: number
          total_listings?: number
          verified_listings_count?: number
          member_since?: string
        }
        Update: {
          business_name?: string | null
          phone_number?: string | null
          response_rate?: number
          trust_score?: number
          total_listings?: number
          verified_listings_count?: number
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          image_url?: string
          display_order?: number
        }
      }
      saved_properties: {
        Row: {
          id: string
          user_id: string
          property_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          saved_at?: string
        }
        Update: never
      }
      verification_log: {
        Row: {
          id: string
          property_id: string
          administrator_id: string
          action: VerificationAction
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          administrator_id: string
          action: VerificationAction
          notes?: string | null
          created_at?: string
        }
        Update: never
      }
    }
  }
}