import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from '../../../services/share-data/share-data.service';
declare var $: any;
declare let swal: any;

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailProductComponent implements OnInit {
  slug: any;
  isDetail: boolean = false;
  picture: string;
  name: string;
  displayed_name: string;
  region: string;
  country: any;
  displayed_vivino_wine_type: string;
  price: number;
  rating: number;
  reviews: number;
  food_1: any;
  food_2: string;
  food_3: string;
  list_shops: any = [];
  list_reviews: any = [];
  amount_list_reviews: number;
  grape: string;
  alcohol: number;
  winery: string;
  regional_styles: string;
  picture_loading: boolean = false;
  info_loading: boolean = false;
  amount_review_show: number = 5;
  vivino_url: string;
  isReadonly: boolean = true;
  translate_object: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private apiService: ApiService,
    private titleService: Title,
    public translate: TranslateService,
    public shareDataService: ShareDataService) {
  }
  async ngOnInit() {
    this.shareDataService.castTranslateObject.subscribe(async translate_object => {
      this.translate_object = translate_object;
    });
    this.route.params.subscribe(params => {
      this.slug = params.slug;
      if (this.slug !== null) {
        this.isDetail = true;
      }
      if (this.isDetail) {
        this.setData();
      }
    });
  }

  alertItemNotFound() {
    swal({
      title: 'No information found',
      type: 'warning',
      timer: 2000
    });
  }

  async setData() {
    try {
      this.picture_loading = this.info_loading = true;
      const data: any = await this.apiService.product.getItemWithSlug(this.slug, {
        query: {
          fields: [
            '$all',
            {
              'nation': ['$all']
            },
            {
              'foods_of_product': ['$all', { 'food': ['name', 'name_vn', 'icon'] }]
            },
            {
              'comments': ['$all']
            },
            {
              'shops_of_product': ['$all',
                { 'shop': ['displayed_name', 'displayed_address', 'displayed_link'] },
                { '$filter': { 'not_in_use': false } }
              ]
            },
          ]
        }
      });
      this.displayed_name = this.showDisplayedNameProduct(data);
      this.titleService.setTitle(this.displayed_name + ' from RiteWine.com');
      this.name = data.name;
      this.picture = data.displayed_picture;
      this.picture_loading = false;
      this.country = data.nation;
      this.displayed_vivino_wine_type = data.displayed_vivino_wine_type;
      this.price = data.price;
      this.rating = data.rating;
      this.reviews = data.reviews;
      this.food_1 = data.foods_of_product;
      this.info_loading = false;
      this.food_2 = this.showFoods(data);
      this.food_3 = this.showFoods2(data);
      this.list_shops = data.shops_of_product;
      this.list_reviews = data.comments;
      if(this.list_reviews.length > 0){
        this.list_reviews.sort((a, b) => b.user.statistics.ratings_count - a.user.statistics.ratings_count);
      }
      this.amount_list_reviews = this.list_reviews.length;
      this.grape = this.showGrapes(data);
      if (data.vivino_region !== null) {
        this.region = data.vivino_region.name;
      }
      this.alcohol = data.alcohol;
      if (data.vivino_winery !== null) {
        this.winery = data.vivino_winery.name;
      }
      if (data.vivino_style !== null) {
        this.regional_styles = data.vivino_style.name;
      }
      this.vivino_url = data.vivino_url;
    } catch (err) {
      this.router.navigate(['/'], { relativeTo: this.route });
      console.log('err: ', err);
    }
  }

  showFoods(item) {
    if (item.displayed_vivino_food === null && item.foods_of_product !== null && item.foods_of_product.length > 0) {
      let food = '';
      for (let i = 0; i < item.foods_of_product.length; i++) {
        let content = item.foods_of_product[i].food.name;
        if (i === item.foods_of_product.length - 1) {
          food += content;
        } else {
          food += content + ', ';
        }
      }
      return food;
    } else {
      return item.displayed_vivino_food;
    }
  }
  
  showFoods2(item) {
    if (item.displayed_vivino_food === null && item.foods_of_product !== null && item.foods_of_product.length > 0) {
      let food = '';
      for (let i = 0; i < item.foods_of_product.length; i++) {
        let content = item.foods_of_product[i].food.name_vn;
        if (i === item.foods_of_product.length - 1) {
          food += content;
        } else {
          food += content + ', ';
        }
      }
      return food;
    } else {
      return item.displayed_vivino_food;
    }
  }

  showGrapes(item) {
    if (item.displayed_vivino_grape !== null && item.displayed_vivino_grape !== '') {
      return item.displayed_vivino_grape;
    } else {
      if (item.displayed_vivino_grape === null && item.vivino_grapes !== null && item.vivino_grapes.length > 0) {
        let grape = '';
        for (let i = 0; i < item.vivino_grapes.length; i++) {
          if (i === item.vivino_grapes.length - 1) {
            grape += item.vivino_grapes[i].name;
          } else {
            grape += item.vivino_grapes[i].name + ', ';
          }
        }
        return grape;
      }
    }
  }

  trackByFn(index) {
    return index;
  }

  showMoreReview() {
    this.amount_review_show = 10;
  }

  scrollToReview(el: HTMLElement) {
    $('html, body').animate({
      scrollTop: $('.product-review').offset().top - 80
    }, 800);
  }

  showDisplayedNameProduct(item) {
    if (item.vivino_winery !== null && item.vivino_winery.name) {
      return item.displayed_name.replace(item.vivino_winery.name + ' ', '');
    } else {
      return item.displayed_name;
    }
  }

  getTranslate(key) {
    let text = '';
    if (this.translate_object && this.translate_object[key]) {
      switch (this.translate.getDefaultLang()) {
        case 'en':
          text = this.translate_object[key].value;
          break;

        default:
          text = this.translate_object[key].value_vn;
          break;
      }
    }
    return text;
  }

  showNameWineType() {
    let wine_type;
    switch (this.displayed_vivino_wine_type) {
      case 'Red Wine':
        wine_type = this.getTranslate('red_wine');
        break;
      case 'White Wine':
        wine_type = this.getTranslate('white_wine');
        break;
      case 'Rosé Wine':
        wine_type = this.getTranslate('rose_wine');
        break;
      case 'Sparkling':
        wine_type = this.getTranslate('sparkling');
        break;
    }
    return wine_type;
  }

  showUserExpertise(rating){
    let expertise;
    if(rating >= 0 && rating < 300){
      expertise = this.getTranslate('novice');
    } else if(rating >= 300 && rating < 999) {
      expertise = this.getTranslate('advanced');
    } else {
      expertise = this.getTranslate('expert');
    }
    return expertise;
  }

  showBgColor(wine_type) {
    let bg_color;
    switch (wine_type) {
      case 'Red Wine':
        bg_color = this.translate_object.red_color.value;
        break;
      case 'White Wine':
        bg_color = this.translate_object.white_color.value;
        break;
      case 'Rosé Wine':
        bg_color = this.translate_object.rose_color.value;
        break;
      case 'Sparkling':
        bg_color = this.translate_object.sparkling_color.value;
        break;
    }
    return bg_color;
  }
}
