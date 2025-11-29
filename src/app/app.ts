import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

interface ContactData {
  name: string;
  phone: string;
  location: string;
  service: string;
  message: string;
}

interface WorkPhoto {
  id: number;
  title: string;
  description: string;
  url: string;
  location: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Venus');
  
  reviews: Review[] = [];
  
  serviceAreas = [
    'Tekkali, Andhra Pradesh',
    'Etcherla, Andhra Pradesh', 
    'Chilakapalem, Andhra Pradesh',
    'Razam, Andhra Pradesh',
    'Vizianagaram, Andhra Pradesh',
    'Amadalavalasa, Andhra Pradesh',
    'Ranastalam, Andhra Pradesh',
    'Arasavilli, Srikakulam, Andhra Pradesh',
    'Yathapeta, Visakhapatnam, Andhra Pradesh'
  ];
  
  newReview: Partial<Review> = {
    name: '',
    rating: 0,
    comment: '',
    location: ''
  };
  

  
  searchLocation = '';
  locationResult = '';
  locationAvailable = false;
  showReviewModal = false;
  toastMessage = '';
  showToast = false;
  flippedCards = [false, false, false, false];
  
  workPhotos: WorkPhoto[] = [
    {
      id: 1,
      title: 'Professional Septic Tank Cleaning',
      description: 'Expert septic tank cleaning service with modern equipment',
      url: 'https://i.pinimg.com/1200x/ca/db/9e/cadb9e4f447f710ecfb6bb5c92792160.jpg',
      location: 'Srikakulam, Andhra Pradesh'
    },
    {
      id: 2,
      title: 'Drainage & Waste Management',
      description: 'Complete drainage system maintenance and waste removal',
      url: 'https://i.pinimg.com/1200x/dc/83/8f/dc838f775b334156d0f4fdb3446cadaa.jpg',
      location: 'Tekkali, Andhra Pradesh'
    }
  ];
  
  constructor() {}
  
  ngOnInit() {
    // Clear old reviews from localStorage
    localStorage.removeItem('venus-reviews');
    this.loadReviews();
  }
  
  ngOnDestroy() {
  }
  
  loadReviews() {
    const saved = localStorage.getItem('venus-reviews');
    const defaultReviews = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        rating: 5,
        comment: 'Excellent service! Venus team cleaned our septic tank efficiently and professionally.',
        date: '2024-01-15',
        location: 'Tekkali'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        rating: 5,
        comment: 'Very reliable and prompt service. They arrived on time and completed the work quickly.',
        date: '2024-01-10',
        location: 'Vizianagaram'
      },
      {
        id: 3,
        name: 'Venkat Rao',
        rating: 4,
        comment: 'Good service quality. Fair pricing and professional approach.',
        date: '2024-01-05',
        location: 'Etcherla'
      },
      {
        id: 4,
        name: 'Lakshmi Devi',
        rating: 5,
        comment: 'Amazing 24/7 service! They helped us during emergency at midnight.',
        date: '2024-01-20',
        location: 'Razam'
      },
      {
        id: 5,
        name: 'Suresh Babu',
        rating: 4,
        comment: 'Clean work and reasonable rates. Will definitely call them again.',
        date: '2024-01-18',
        location: 'Amadalavalasa'
      }
    ];
    
    if (saved) {
      try {
        this.reviews = JSON.parse(saved);
      } catch {
        this.reviews = defaultReviews;
        this.saveReviews();
      }
    } else {
      this.reviews = defaultReviews;
      this.saveReviews();
    }
  }
  

  
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
  
  getDuplicatedReviews(): Review[] {
    return [...this.reviews, ...this.reviews];
  }
  
  getDuplicatedLocations(): string[] {
    return [...this.serviceAreas, ...this.serviceAreas];
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  openReviewModal() {
    this.showReviewModal = true;
  }
  
  closeReviewModal() {
    this.showReviewModal = false;
    this.newReview = { name: '', rating: 0, comment: '', location: '' };
  }
  
  addReview() {
    if (this.newReview.name && this.newReview.rating && this.newReview.comment && this.newReview.location) {
      const review: Review = {
        id: Date.now(),
        name: this.newReview.name,
        rating: Number(this.newReview.rating),
        comment: this.newReview.comment,
        location: this.newReview.location,
        date: new Date().toISOString().split('T')[0]
      };
      
      this.reviews.unshift(review);
      this.saveReviews();
      this.closeReviewModal();
      this.showToastMessage('✅ Thank you! Your review has been added successfully.');
    }
  }
  
  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }
  
  checkLocation() {
    if (!this.searchLocation.trim()) {
      this.locationResult = '';
      this.locationAvailable = false;
      return;
    }
    
    const searchTerm = this.searchLocation.toLowerCase();
    const matchingLocations = this.serviceAreas.filter(area => 
      area.toLowerCase().includes(searchTerm)
    );
    
    if (matchingLocations.length > 0) {
      this.locationAvailable = true;
      if (matchingLocations.length === 1) {
        this.locationResult = `✅ Service Available: ${matchingLocations[0]}`;
        this.showToastMessage(`🎉 Great! We serve ${matchingLocations[0]}. Call us now!`);
      } else {
        this.locationResult = `✅ Service Available in ${matchingLocations.length} locations:<br>• ${matchingLocations.join('<br>• ')}`;
        this.showToastMessage(`🎉 We serve ${matchingLocations.length} matching locations! Call us for service!`);
      }
    } else {
      this.locationAvailable = false;
      this.locationResult = `⚠️ Service not available in "${this.searchLocation}". We currently serve areas in Srikakulam district.`;
      this.showToastMessage(`📍 "${this.searchLocation}" not in our service area. Check our service locations above!`);
    }
  }
  
  saveReviews() {
    localStorage.setItem('venus-reviews', JSON.stringify(this.reviews));
  }
  
  toggleCard(index: number) {
    this.flippedCards[index] = !this.flippedCards[index];
  }
  

}
