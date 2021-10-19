import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Options } from 'ng5-slider';
import { ApiService } from '../../services/api/api.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NumberPipe } from '../../pipes/NumberPipe/NumberPipe';
import { ShareDataService } from '../../services/share-data/share-data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { PlatformLocation } from '@angular/common';
declare var $: any;

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  listProducts: any;
  listProductsWithFeatured: any = [];
  count: number = 0;
  limit: number = 6;
  page: number = 1;
  minPrice: number = 300;
  maxPrice: number = 700;
  options: Options = {
    floor: 0,
    ceil: 1500,
    step: 100,
    noSwitching: true,
    translate: (value: number): string => {
      let decimalPipe = new NumberPipe;
      let price = decimalPipe.transform(value);
      if (value === 1500) {
        price = decimalPipe.transform(value) + '+';
      }
      return price;
    },
    animate: false
  };
  loading: boolean = false;
  search_loading: boolean = false;
  featured_loading: boolean = true;
  filter: any = {
    crawl_from: 'VIVINO',
    maybe_duplicate: false,
    editable: false,
    not_in_use: false
  };
  listCountries: any = [];
  listFoods: any = [];
  country_id: string = null;
  list_foods_from_header_dropdown: any;
  list_ids_food: any = [];
  displayed_name: string = null;
  interval: boolean = false;
  noWrap: boolean = true;
  singleSlideOffset: boolean = true;
  i_more_info: number;
  row_more_info: number;
  featured: string = 'DAILY_DRINKS';
  more_info_wine: any;
  more_info_close: boolean;
  country_selected: any;
  order: any = [['rating', 'DESC'], ['updated_at', 'DESC']];
  order_by: string = 'ratings_2';
  isLast: boolean;
  attributes: any = [
    'id', 'displayed_vivino_wine_type', 'displayed_picture', 'vivino_winery', 'displayed_name', 'price', 'rating', 'reviews', 'slug', 'country_id', 'updated_at'
  ];
  include: any = [
    {
      association: 'nation',
      attributes: [
        'name',
        'code',
        'name_vn'
      ]
    }
  ];
  fields2: any = [
    'id',
    'displayed_vivino_wine_type',
    'country_id',
    'displayed_picture',
    'vivino_winery',
    'displayed_name',
    'price',
    'rating',
    'reviews',
    'slug',
    'vivino_region',
    'vivino_style',
    'displayed_vivino_food',
    'displayed_vivino_grape',
    'vivino_grapes',
    { 'nation': ['name', 'code', 'name_vn'] },
    { 'comments': ['$all'] },
    {
      'shops_of_product': [
        '$all',
        { 'shop': ['displayed_name', 'displayed_address', 'displayed_link'] },
        { '$filter': { 'not_in_use': false } }]
    },
    { 'foods_of_product': ['$all', { 'food': ['name', 'name_vn', 'icon'] }] }
  ];
  statistic: any;
  loading_get_more_product: boolean = false;
  price_from: any = 300;
  price_to: any = 700;
  reset_all: boolean = false;
  translate_object: any;
  browser_is: string = 'pc';
  device_os: string = null;
  modalMoreInfoRef: BsModalRef;
  amount_review_show: number = 3;
  array_wine_type: any = [];
  configSwiperSliderPC: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 3,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: {
      nextEl: '.swiper-button-next-unique',
      prevEl: '.swiper-button-prev-unique'
    },
    pagination: false,
    speed: 500,
    allowTouchMove: false
  };
  configSwiperSliderTablet: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 2,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    speed: 500,
    allowTouchMove: true
  };
  configSwiperSliderMobile: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    speed: 500,
    allowTouchMove: true
  };
  loading_more_info: boolean = false;
  settings: any;
  foods_selected: any;
  food_id: string = null;
  modal_more_info_opened: boolean;
  list_foods_multiple_select: any;
  listTags: any;
  tag: any;
  change_country: boolean = false;
  clicked_show_more_info: boolean = false;
  select_tag: any = null;
  @ViewChild('rangePrice') rangePrice;
  constructor(
    private titleService: Title,
    private apiService: ApiService,
    public translate: TranslateService,
    public router: Router,
    public shareDataService: ShareDataService,
    public activeRoute: ActivatedRoute,
    public modalService: BsModalService,
    public location: PlatformLocation) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      if (event.lang === 'en') {
        this.settings = {
          text: 'All meals',
          enableSearchFilter: false,
          singleSelection: false,
          enableCheckAll: false,
          badgeShowLimit: 1,
          classes: 'food-multiple-select',
          labelKey: 'name'
        };
        if (this.translate_object.find_the_wine_you_love) {
          this.titleService.setTitle(this.translate_object.find_the_wine_you_love.value + ' - RiteWine.com');
          $('.welcome-des').text(this.translate_object.find_the_wine_you_love.value);
        }
      } else if (event.lang === 'vi') {
        this.settings = {
          text: 'Tất cả',
          enableSearchFilter: false,
          singleSelection: false,
          enableCheckAll: false,
          badgeShowLimit: 1,
          classes: 'food-multiple-select',
          labelKey: 'name_vn'
        };
        if (this.translate_object.find_the_wine_you_love) {
          this.titleService.setTitle(this.translate_object.find_the_wine_you_love.value_vn + ' - RiteWine.com');
          $('.welcome-des').text(this.translate_object.find_the_wine_you_love.value_vn);
        }
      }
    });
    location.onPopState((e) => {
      if (this.browser_is !== 'pc' && this.device_os === 'AndroidOS') {
        if (this.modalMoreInfoRef) {
          this.modalMoreInfoRef.hide();
          return false;
        } else {
          return true;
        }
      }
    });
  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   if (
  //     this.user_does_nothing && document.body.scrollTop > 165
  //     ||
  //     this.user_does_nothing && document.documentElement.scrollTop > 165
  //   ) {
  //     this.form_search_fixed = true;
  //   } else {
  //     this.form_search_fixed = false;
  //   }
  // }

  async ngOnInit() {
    this.shareDataService.castTranslateObject.subscribe(async translate_object => {
      this.translate_object = translate_object;
      if (this.translate_object.find_the_wine_you_love && this.translate.getDefaultLang() === 'en') {
        this.titleService.setTitle(this.translate_object.find_the_wine_you_love.value + ' - RiteWine.com');
      } else if (this.translate_object.find_the_wine_you_love && this.translate.getDefaultLang() === 'vi') {
        this.titleService.setTitle(this.translate_object.find_the_wine_you_love.value_vn + ' - RiteWine.com');
      }
    });
    this.shareDataService.castDetectDevice.subscribe(device => {
      if (device) {
        this.browser_is = device.browser_is;
        this.device_os = device.device_os;
      }
    });
    //await this.getProductStatistic();
    await this.getListTags();
    this.shareDataService.castListFoods.subscribe(listFoods => {
      if (listFoods && listFoods.length > 0) {
        this.listFoods = listFoods;
        this.listFoods.unshift({
          id: null,
          name: 'All meals',
          name_vn: 'Tất cả'
        })
      }
    });
    await this.getListProductsInit();
    await this.getListProductWithFeatured();
    await this.getListCountries();
    this.shareDataService.castDisplayedName.subscribe(async displayed_name => {
      if (displayed_name !== undefined) {
        this.change_country = false;
        this.displayed_name = displayed_name;
        await this.search();
      }
    });
    if (this.browser_is !== 'pc' && this.device_os === 'AndroidOS') {
      let closedModalHash = '';
      let openModalHash = '#o';
      history.pushState(null, null, closedModalHash);
      this.modalService.onShow.subscribe((reason: string) => {
        this.modal_more_info_opened = true;
        history.pushState(null, null, openModalHash);
      });
      this.modalService.onHide.subscribe((reason: string) => {
        this.modal_more_info_opened = false;
        history.pushState(null, null, closedModalHash);
      });
    }
    this.shareDataService.castListFoodsDropdown.subscribe(async list_foods_from_header_dropdown => {
      if (list_foods_from_header_dropdown) {
        // if (list_foods_from_header_dropdown.length > 0) {
        //   this.foods_selected = this.list_foods_multiple_select = list_foods_from_header_dropdown;
        // } else {
        //   this.foods_selected = this.list_foods_multiple_select = [{
        //     id: null,
        //     name: 'All meals',
        //     name_vn: 'Tất cả'
        //   }];
        // }
        this.changeFoodFromHeader(list_foods_from_header_dropdown);
      }
    });
    $('#displayed_name_search').keypress(async (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        $(document.activeElement).filter(':input:focus').blur();
        this.displayed_name = event.target.value;
        await this.search();
      }
    });
    window.scrollTo(0, 0);
  }

  async getListProducts() {
    try {
      this.loading = true;
      this.listProducts = await this.apiService.product.search(this.limit, this.page, {
        filter: this.filter,
        order: this.order,
        include: this.include,
        attributes: this.attributes
      });
      this.count = this.apiService.product.pagination.totalItems;
      if (this.list_foods_from_header_dropdown) {
        this.shareDataService.setAmoutProduct(this.count);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  async changeRangePrice(event) {
    if (event.value !== this.price_from || event.highValue !== this.price_to) {
      this.change_country = false;
      setTimeout(async () => {
        await this.search();
      }, 500);
    }
  }

  trackByFn(item) {
    return item.id;
  }

  async changeWineType(event) {
    this.change_country = false;
    if (this.array_wine_type.includes(event)) {
      var index = this.array_wine_type.indexOf(event);
      if (index !== -1) this.array_wine_type.splice(index, 1);
    } else {
      this.array_wine_type.push(event);
    }
    if (this.array_wine_type.length > 0) {
      this.filter.displayed_vivino_wine_type = { $in: this.array_wine_type };
    } else {
      if (this.filter.displayed_vivino_wine_type) {
        delete this.filter.displayed_vivino_wine_type;
      }
    }
    await this.search();
  }

  async getListCountries() {
    try {
      this.listCountries = await this.apiService.country.search(
        {
          include: [
            {
              association: 'products',
              attributes: ['id'],
              where: this.filter,
              include: this.include,
            }
          ],
          attributes: [
            'id',
            'name',
            'name_vn',
            'updated_at'
          ]
        }
      );
      this.listCountries = this.listCountries.filter(e => e.products.length > 0).map(e => {
        e.amout_products = e.products.length;
        return e;
      });
    } catch (error) {
    }
  }

  async changeCountry(country_id) {
    this.change_country = true;
    if (country_id !== null) {
      this.country_id = country_id;
      this.filter.country_id = this.country_id;
    } else {
      if (this.filter.country_id) {
        delete this.filter.country_id;
      }
    }
    await this.search();
  }

  async search() {
    this.reset_all = true;
    this.limit = 6;
    this.page = 1;
    this.more_info_close = true;
    this.search_loading = true;
    this.price_from = this.rangePrice.value;
    this.price_to = this.rangePrice.highValue;
    if (this.rangePrice.highValue < 1500) {
      this.filter.price = { '$gte': this.rangePrice.value * 1000, '$lte': this.rangePrice.highValue * 1000 };
    } else {
      this.filter.price = { '$gte': this.rangePrice.value * 1000 };
    }
    this.country_selected = this.listCountries.filter(e => e.id === this.country_id);
    if (this.filter.rating) {
      delete this.filter.rating;
    }
    if (this.displayed_name !== null && this.displayed_name !== '') {
      this.filter.displayed_name = { '$iLike': `%${this.displayed_name}%` };
    } else {
      delete this.filter.displayed_name;
    }
    if (this.country_id !== null) {
      this.filter.country_id = this.country_id;
    } else {
      if (this.filter.country_id) {
        delete this.filter.country_id;
      }
    }
    await this.getListProducts();
    await this.getListCountriesWithFilter();
    this.search_loading = false;
    let top = 80;
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 1024) {
      top = 0;
    }
    $('html, body').animate({
      scrollTop: $('#form-search').offset().top - top
    }, 800);
  }

  async showMoreInfo(i, id, isLast) {
    if (this.i_more_info !== undefined && this.i_more_info === i) {
      this.more_info_close = !this.more_info_close;
      $('.more-info-content').removeClass('animated fadeOutUp zoomIn');
      if (!this.more_info_close) {
        $('.more-info-content').addClass('animated zoomIn');
      }
    } else {
      this.i_more_info = i;
      $('.more-info-content').removeClass('animated fadeOutUp zoomIn');
      this.loading_more_info = true;
      this.more_info_wine = await this.getMoreInfo(id);
      if (this.more_info_wine && this.more_info_wine.comments.length > 0) {
        this.more_info_wine.comments.sort((a, b) => b.user.statistics.ratings_count - a.user.statistics.ratings_count);
      }
      this.loading_more_info = false;
      if (!this.clicked_show_more_info) {
        setTimeout(() => {
          $('.more-info-content').addClass('animated zoomIn');
        }, 100);
      } else {
        if (this.row_more_info !== this.fnFloor(i)) {
          $('.more-info-content').addClass('animated zoomIn');
        }
      }
      this.isLast = isLast;
      this.row_more_info = Math.floor(this.i_more_info / 3);
      this.clicked_show_more_info = true;
      setTimeout(() => {
        this.more_info_close = false;
      }, 100);
    }
    setTimeout(() => {
      $('html, body').animate({
        scrollTop: $('#wine-search-' + id).offset().top + 270
      }, 800);
    }, 100);
  }

  fnFloor(i) {
    return Math.floor(i / 3);
  }

  showDisplayedNameProduct(item) {
    if (item.vivino_winery !== null && item.vivino_winery.name) {
      return item.displayed_name.replace(item.vivino_winery.name + ' ', '');
    } else {
      return item.displayed_name;
    }
  }

  async getListProductWithFeatured() {
    try {
      this.listProductsWithFeatured = await this.apiService.product.getList({
        query: {
          fields: [
            'displayed_vivino_wine_type',
            'vivino_winery',
            'displayed_name',
            'displayed_vivino_wine_type',
            'displayed_picture',
            'rating',
            'reviews',
            'price',
            'slug',
            'country_id',
            { 'nation': ['name', 'code', 'name_vn'] },
          ],
          filter: { featured: this.featured, crawl_from: 'VIVINO', not_in_use: false, editable: false, maybe_duplicate: false },
          order: [['priority', 'ASC']],
          limit: 999999,
          page: 1
        }
      });
      this.featured_loading = false;
    } catch (error) {
      this.featured_loading = false;
    }
  }

  async changeFeatured(featured) {
    $('#swiper-home').removeClass('animated fadeInUp fadeInLeft fadeInRight');
    this.featured = featured;
    await this.getListProductWithFeatured();
    switch (this.featured) {
      case 'DAILY_DRINKS':
        $('#swiper-home').addClass('animated fadeInLeft');
        break;
      case 'EXTRAORDINARIES':
        $('#swiper-home').addClass('animated fadeInRight');
        break;
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

  showFoods(item) {
    if (item.displayed_vivino_food === null && item.foods_of_product !== null && item.foods_of_product.length > 0) {
      let food = '';
      for (let i = 0; i < item.foods_of_product.length; i++) {
        if (i === item.foods_of_product.length - 1) {
          food += item.foods_of_product[i].food.name;
        } else {
          food += item.foods_of_product[i].food.name + ', ';
        }
      }
      return food;
    }
  }

  showFoods2(item) {
    if (item.displayed_vivino_food === null && item.foods_of_product !== null && item.foods_of_product.length > 0) {
      let food = '';
      for (let i = 0; i < item.foods_of_product.length; i++) {
        if (i === item.foods_of_product.length - 1) {
          food += item.foods_of_product[i].food.name_vn;
        } else {
          food += item.foods_of_product[i].food.name_vn + ', ';
        }
      }
      return food;
    }
  }

  closeMoreInfo(id) {
    $('.more-info-content').removeClass('animated fadeOutUp zoomIn');
    $('html, body').animate({
      scrollTop: $('#wine-search-' + id).offset().top + 270
    }, 800);
    setTimeout(() => {
      $('.more-info-content').removeClass('animated zoomIn');
      $('#more-info-' + id).addClass('animated fadeOutUp');
      $('.more-info-content').removeClass('animated fadeOutUp zoomIn');
    }, 800);
    setTimeout(() => {
      this.more_info_close = true;
    }, 700);
  }

  async changeOrderBy(order_by) {
    this.search_loading = true;
    this.order_by = order_by;
    this.page = 1;
    switch (order_by) {
      case 'ratings_2':
        this.order = [['rating', 'DESC'], ['updated_at', 'DESC']];
        break;
      case 'price_low_high':
        this.order = [['price', 'ASC'], ['updated_at', 'DESC']];
        break;
      case 'price_high_low':
        this.order = [['price', 'DESC'], ['updated_at', 'DESC']];
        break;
      case 'popularity':
        this.order = [['reviews', 'DESC'], ['updated_at', 'DESC']];
        break;
      default:
        this.order = [['updated_at', 'DESC'], ['updated_at', 'DESC']];
        break;
    }
    await this.getListProducts();
    this.search_loading = false;
  }

  returnStringOrderBy() {
    return this.getTranslate(this.order_by);
  }

  checkShowMoreInfo(i) {
    if (this.row_more_info === this.fnFloor(i)) {
      return true;
    } else {
      return false;
    }
    // if (
    //   this.row_more_info === this.fnFloor(i) && (i + 1) % 3 === 0 && !this.isLast && !this.more_info_close
    //   ||
    //   this.row_more_info === this.fnFloor(i) && this.i_more_info + 2 === i && !this.isLast && !this.more_info_close
    // ) {
    //   return true;
    // } else if (this.row_more_info === this.fnFloor(i) && i + 1 === this.listProducts.length && this.isLast && !this.more_info_close) {
    //   return true;
    // } else if (this.row_more_info === this.fnFloor(i) && this.i_more_info + 1 === i && i + 1 === this.listProducts.length && !this.isLast && !this.more_info_close) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  async changeFoodFromHeader(list_foods_from_header_dropdown) {
    this.change_country = false;
    this.list_foods_from_header_dropdown = list_foods_from_header_dropdown;
    if (this.list_foods_from_header_dropdown.length > 0) {
      this.list_ids_food = this.list_foods_from_header_dropdown.map(e => e.id);
      if (this.list_foods_from_header_dropdown.length === 1) {
        this.food_id = this.list_foods_from_header_dropdown[0].id;
      } else {
        this.listFoods[0].name = 'Mixed';
        this.listFoods[0].name_vn = 'Hỗn hợp';
        this.food_id = null;
      }
      this.filter.food_contains = { $contains: this.list_ids_food }
    } else {
      if (this.filter.food_contains) {
        delete this.filter.food_contains
      }
      this.listFoods[0].name = 'All meals';
      this.listFoods[0].name_vn = 'Tất cả';
      this.food_id = null;
    }
    await this.search();
  }

  async changeFood(food_id) {
    this.change_country = false;
    this.listFoods[0].name = 'All meals';
    this.listFoods[0].name_vn = 'Tất cả';
    this.list_ids_food = [];
    this.food_id = food_id;
    if (this.food_id !== 'null') {
      this.list_ids_food = [this.food_id];
      this.list_foods_multiple_select = this.listFoods.filter(e => e.id === this.food_id);
      this.filter.food_contains = { $contains: this.list_ids_food }
    } else {
      if (this.filter.food_contains) {
        delete this.filter.food_contains;
      }
      this.list_foods_multiple_select = undefined;
    }
    this.shareDataService.setListFoodsMultipleSelect(this.list_foods_multiple_select);
    await this.search();
  }

  // async getProductStatistic() {
  //   try {
  //     this.statistic = await this.apiService.product.getStatistic();
  //   } catch (error) {

  //   }
  // }

  async getMoreProduct() {
    try {
      if (this.attributes[this.attributes.length - 1].$filter) {
        this.attributes.splice(-1, 1);
      }
      if (this.attributes[this.attributes.length - 1].foods_of_product) {
        this.attributes.splice(-1, 1);
      }
      // if (this.i_more_info < this.listProducts.length && this.i_more_info >= this.listProducts.length - 3) {
      //   setTimeout(() => {
      //     $('html, body').animate({
      //       scrollTop: $('#wine-search-' + this.more_info_wine.id).offset().top + 270
      //     }, 800);
      //   }, 100);
      // }
      // this.show_arrow_box = false;
      // this.more_info_close = true;
      this.loading_get_more_product = true;
      this.page = this.page + 1;
      if (this.filter.displayed_name) {
        this.filter.displayed_name = { '$iLike': `%${this.displayed_name}%` };
      }
      let list_products = await this.apiService.product.search(this.limit, this.page, {
        filter: this.filter,
        order: this.order,
        include: this.include,
        attributes: this.attributes
      });
      this.listProducts = this.listProducts.concat(list_products);
      this.loading_get_more_product = false;
    } catch (error) {
      this.loading_get_more_product = false;
    }
  }

  async resetFilter() {
    $('#displayed_name_search').val('');
    this.listFoods[0].name = 'All meals';
    this.listFoods[0].name_vn = 'Tất cả';
    this.change_country = false;
    this.displayed_name = null;
    this.array_wine_type = [];
    this.minPrice = this.price_from = 300;
    this.maxPrice = this.price_to = 700;
    this.tag = undefined;
    this.country_id = null;
    this.food_id = null;
    this.attributes = [
      'displayed_vivino_wine_type', 'displayed_picture', 'vivino_winery', 'displayed_name', 'price', 'rating', 'reviews', 'slug', 'country_id',
    ];
    this.include = [
      {
        association: 'nation',
        attributes: [
          'name',
          'code',
          'name_vn'
        ]
      }
    ];
    this.filter = {
      crawl_from: 'VIVINO',
      maybe_duplicate: false,
      editable: false,
      not_in_use: false
    };
    this.shareDataService.setListFoodsMultipleSelect(undefined);
    this.shareDataService.resetDisplayedNameInHeader(undefined);
    $('html, body').animate({
      scrollTop: $('html, body').offset().top
    }, 800);
    await this.getListProductsInit();
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

  async changeDisplayedName() {
    this.displayed_name = $('#displayed_name_search').val();
    await this.search();
  }

  async openMoreInfoModal(template: TemplateRef<any>, id) {
    this.more_info_wine = await this.getMoreInfo(id);
    if (this.more_info_wine.comments.length > 0) {
      this.more_info_wine.comments.sort((a, b) => b.user.statistics.ratings_count - a.user.statistics.ratings_count);
    }
    this.modalMoreInfoRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-info-wine' })
    );
  }

  showMoreReview() {
    this.amount_review_show = this.amount_review_show + 3;
  }

  showNameWineType(item) {
    let wine_type;
    switch (item.displayed_vivino_wine_type) {
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

  checkWineTypeIssetArray(wine_type) {
    if (this.array_wine_type.includes(wine_type)) {
      return true;
    } else {
      return false;
    }
  }

  async getMoreInfo(id) {
    try {
      const more_info = await this.apiService.product.getItem(id, {
        query: {
          fields: this.fields2
        }
      });
      return more_info;
    } catch (error) {
    }
  }

  showUserExpertise(rating) {
    let expertise;
    if (rating >= 0 && rating < 300) {
      expertise = this.getTranslate('novice');
    } else if (rating >= 300 && rating < 999) {
      expertise = this.getTranslate('advanced');
    } else {
      expertise = this.getTranslate('expert');
    }
    return expertise;
  }

  getWidthOfBrowser() {
    return $(window).width();
  }

  // async onSelectFood(item: any) {
  //   if (item.id !== null) {
  //     this.foods_selected = this.foods_selected.filter(e => e.id !== null);
  //     this.list_foods_multiple_select = this.list_foods_multiple_select.filter(e => e.id !== null);
  //     const food_selected = this.listFoods.filter(e => e.id === item.id);
  //     const food = this.list_foods_multiple_select.indexOf(item);
  //     if (food === -1) {
  //       this.list_foods_multiple_select.push(food_selected[0]);
  //       this.list_ids_food.push(item.id);
  //     }
  //   } else {
  //     this.list_ids_food = this.list_foods_multiple_select = [];
  //     this.foods_selected = [{
  //       id: null,
  //       name: 'All meals',
  //       name_vn: 'Tất cả'
  //     }];
  //   }
  //   if (this.list_ids_food.length > 0) {
  //     const list_ids_food_with_object = this.list_ids_food.map(e => {
  //       return {
  //         food_id: e
  //       }
  //     });
  //     this.fields = [
  //       'displayed_vivino_wine_type', 'displayed_picture', 'vivino_winery', 'displayed_name', 'price', 'rating', 'reviews', 'slug', 'country_id',
  //       { 'nation': ['name', 'code'] },
  //       {
  //         'foods_of_product': [
  //           '$all',
  //           { 'food': ['name', 'name_vn'] },
  //           { '$filter': { '$or': list_ids_food_with_object } }
  //         ]
  //       },
  //     ];
  //   } else {
  //     this.fields = [
  //       'displayed_vivino_wine_type', 'displayed_picture', 'vivino_winery', 'displayed_name', 'price', 'rating', 'reviews', 'slug', 'country_id',
  //       { 'nation': ['name', 'code'] },
  //       {
  //         'foods_of_product': [
  //           '$all',
  //           { 'food': ['name', 'name_vn'] }
  //         ]
  //       },
  //     ];
  //   }
  //   this.shareDataService.setListFoodsMultipleSelect(this.list_foods_multiple_select);
  //   await this.search();
  // }

  // async onDeSelectFood(item: any) {
  //   const food = this.list_foods_multiple_select.indexOf(item);
  //   if (food !== -1) this.list_foods_multiple_select.splice(food, 1);
  //   const id_food = this.list_ids_food.indexOf(item.id);
  //   if (id_food !== -1) this.list_ids_food.splice(id_food, 1);
  //   if (this.list_ids_food.length > 0) {
  //     const list_ids_food_with_object = this.list_ids_food.map(e => {
  //       return {
  //         food_id: e
  //       }
  //     });
  //     this.fields = [
  //       'displayed_vivino_wine_type', 'displayed_picture', 'vivino_winery', 'displayed_name', 'price', 'rating', 'reviews', 'slug', 'country_id',
  //       { 'nation': ['name', 'code'] },
  //       {
  //         'foods_of_product': [
  //           '$all',
  //           { 'food': ['name', 'name_vn'] },
  //           { '$filter': { '$or': list_ids_food_with_object } }
  //         ]
  //       },
  //     ];
  //   } else {
  //     this.fields = [
  //       'displayed_vivino_wine_type', 'displayed_picture', 'vivino_winery', 'displayed_name', 'price', 'rating', 'reviews', 'slug', 'country_id',
  //       { 'nation': ['name', 'code'] },
  //       {
  //         'foods_of_product': [
  //           '$all',
  //           { 'food': ['name', 'name_vn'] }
  //         ]
  //       },
  //     ];
  //   }
  //   this.shareDataService.setListFoodsMultipleSelect(this.list_foods_multiple_select);
  //   await this.search();
  // }

  async getListTags() {
    try {
      this.listTags = await this.apiService.tag.getList({
        query: {
          fields: ['$all'],
          limit: 99999,
          order: [['type', 'ASC']]
        }
      });
    } catch (error) {

    }
  }

  async changeTag(item) {
    this.include = [
      {
        association: 'nation',
        attributes: [
          'name',
          'code',
          'name_vn'
        ]
      }
    ];
    this.page = 1;
    if (this.tag && this.tag === item) {
      this.change_country = true;
      this.tag = undefined;
    } else {
      this.change_country = false;
      this.tag = item;
      this.include.push({
        association: 'foods_of_product',
        include: [
          {
            association: 'food',
            attributes: [
              'name',
              'name_vn'
            ]
          }
        ],
        where: {
          food_id: {
            '$in': this.tag.foods
          }
        }
      });
    }
    await this.search();
  }

  async changeSelectTag(event) {
    if (event.target.id === 'meal') {
      $('#occasion').val('null');
    } else {
      $('#meal').val('null');
    }
    this.select_tag = null;
    if (event.target.value !== 'null') {
      this.select_tag = event.target.value.split(',');
    }
    this.include = [
      {
        association: 'nation',
        attributes: [
          'name',
          'code',
          'name_vn'
        ]
      }
    ];
    this.page = 1;
    if (this.select_tag === null) {
      this.change_country = true;
    } else {
      this.change_country = false;
      this.include.push({
        association: 'foods_of_product',
        include: [
          {
            association: 'food',
            attributes: [
              'name',
              'name_vn'
            ]
          }
        ],
        where: {
          food_id: {
            '$in': this.select_tag
          }
        }
      });
    }
    await this.search();
  }

  async getListProductsInit() {
    this.limit = 6;
    this.page = 1;
    this.filter.price = { '$gte': this.minPrice * 1000, '$lte': this.maxPrice * 1000 };
    await this.getListProducts();
  }

  async getListCountriesWithFilter() {
    try {
      let list_countries = await this.apiService.country.search(
        {
          include: [
            {
              association: 'products',
              attributes: ['id'],
              where: this.filter,
              include: this.include,
            }
          ],
          attributes: [
            'id',
            'name',
            'name_vn',
            'updated_at'
          ]
        }
      );
      list_countries = list_countries.map((e: any) => {
        e.amout_products = e.products.length;
        return e;
      });
      for (let i = 0; i < this.listCountries.length; i++) {
        const country: any = list_countries.filter((e: any) => e.id === this.listCountries[i].id);
        if (country.length > 0) {
          this.listCountries[i].amout_products = country[0].amout_products;
        } else {
          if (!this.change_country) {
            this.listCountries[i].amout_products = 0;
          }
        }
      }
    } catch (error) {
    }
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

  showBgFeatured() {
    if (this.translate_object.bg_featured) {
      return this.translate_object.bg_featured.value;
    }
  }

  showBgColorViewMoreWine() {
    return 'linear-gradient(45deg, ' + this.translate_object.view_more_wines_bg_color_1.value + ', ' + this.translate_object.view_more_wines_bg_color_2.value + ')';
  }

  showBgColorWelcomeDes() {
    if (this.translate_object.welcome_text_gradient_color_1 && this.translate_object.welcome_text_gradient_color_2) {
      return {
        'background': 'linear-gradient(45deg, ' + this.translate_object.welcome_text_gradient_color_1.value + ',' + this.translate_object.welcome_text_gradient_color_2.value + ' 80%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent'
      }
    }
  }

  showClassArrowBox() {
    return (this.i_more_info + 1) % 3;
  }
}
