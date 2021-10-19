import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ApiService } from '../../services/api/api.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ShareDataService } from '../../services/share-data/share-data.service';
import { ConfigService } from '../../services/config/config.service';
declare var $: any;
declare var MobileDetect: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  listFoods: any = [];
  show_ele: boolean = true;
  translate_object: any;
  list_food_selected: any = [];
  amout_product: number = 0;
  choose_all_foods: boolean = false;
  browser_is: string = 'pc';
  device_os: string = null;
  constructor(public translate: TranslateService,
    public apiService: ApiService,
    public shareDataService: ShareDataService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public configService: ConfigService) {
    if (this.configService.lang === null) {
      this.configService.lang = 'en';
    }
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(this.configService.lang);
    const browserLang = this.configService.lang
    translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
    });
  }

  async ngOnInit() {
    await this.getTranslateObject();
    this.detectDevice();
    if (this.activeRoute.children[0].routeConfig.path === ':slug' || this.activeRoute.children[0].routeConfig.path === 'faqs') {
      this.show_ele = false;
    }
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url === '/faqs') {
          this.show_ele = false;
        }
      }
    });
    await this.getListFoods();
    $(document).scroll(function () {
      var y = $(this).scrollTop();
      if (y > 200) {
        $('#topcontrol').show();
      } else {
        $('#topcontrol').hide();
      }
    });
    $("#topcontrol").click(function () {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });
    $('.food').hover(function () {
      $('.list-food').removeClass('d-none');
    }, function () {
      $('.list-food').removeClass('d-none');
    });
    if (this.browser_is === 'pc') {
      var textInput: any = document.getElementById('displayed_name');
      var timeout = null;
      if (textInput) {
        textInput.onkeyup = (e) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            const array_text_input = textInput.value.split('');
            if (array_text_input.length > 0) {
              for (let i = 0; i < array_text_input.length; i++) {
                const element = array_text_input[i];
                if (element !== ' ') { break; }
                textInput.value = textInput.value.replace(element, '');
              }
            }
            this.shareDataService.setDisplayedNameFromHeader(textInput.value);
          }, 500);
        };
      }
    } else if (this.browser_is === 'tablet') {
      $("#displayed_name").keypress(async (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          $(document.activeElement).filter(':input:focus').blur();
          this.shareDataService.setDisplayedNameFromHeader(event.target.value);
        }
      });
    }

    this.shareDataService.castAmoutProduct.subscribe(amout_product => {
      this.amout_product = amout_product;
    });
    this.shareDataService.castListFoodsMultipleSelect.subscribe(async list_foods_from_home => {
      if (list_foods_from_home) {
        this.choose_all_foods = false;
        this.list_food_selected = list_foods_from_home;
      } else {
        this.list_food_selected = [];
      }
    });
    this.shareDataService.castResetDisplayedNameInHeader.subscribe(displayed_name => {
      if (!displayed_name) {
        var textInput: any = document.getElementById('displayed_name');
        if (textInput) {
          textInput.value = null;
        }
      }
    })
  }

  changeLanguage(lang) {
    if (this.translate.getDefaultLang() !== lang) {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.configService.lang = lang;
    } else {
      return;
    }
  }

  async getListFoods() {
    try {
      this.listFoods = await this.apiService.food.getList(
        {
          query: {
            fields: ['$all'],
            filter: { 'icon': { '$ne': null } },
            order: [['name', 'ASC']]
          }
        }
      );
      this.shareDataService.setListFoodsFromHeader(this.listFoods);
    } catch (error) {
    }
  }

  changeFood(food) {
    if (food === 'all') {
      this.choose_all_foods = true;
      this.list_food_selected = [];
    } else {
      // this.choose_all_foods = false;
      // if (this.list_food_selected.indexOf(food) === -1) {
      //   this.list_food_selected.push(food);
      // } else {
      //   var index = this.list_food_selected.indexOf(food);
      //   if (index !== -1) this.list_food_selected.splice(index, 1);
      // }
      $('.list-food').addClass('d-none');
      this.list_food_selected = [food];
    }
    this.shareDataService.setListFoodsChoosenFromHeader(this.list_food_selected);
  }

  checkFoodInArray(food) {
    if (this.list_food_selected.indexOf(food) === -1) {
      return false;
    } else {
      return true;
    }
  }

  changeDisplayedName(displayed_name) {
    if (displayed_name.length >= 3) {
      this.shareDataService.setDisplayedNameFromHeader(displayed_name);
    } else {
      return;
    }
  }

  async getTranslateObject() {
    try {
      this.translate_object = await this.apiService.translate.getListObject({
        query: {
          fields: ['$all'],
          limit: 9999
        }
      });
      this.shareDataService.setTranslateObject(this.translate_object);
    } catch (error) {

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

  hiddenFoodDropdown() {
    $('.list-food').addClass('d-none');
    let top = 80;
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 1024) {
      top = 0;
    }
    $('html, body').animate({
      scrollTop: $('#form-search').offset().top - top
    }, 800);
  }

  showListFoodsSelected() {
    if (this.translate.getDefaultLang() === 'en') {
      return this.list_food_selected[0].name;
    } else if (this.translate.getDefaultLang() === 'vi') {
      return this.list_food_selected[0].name_vn;
    }
  }

  detectDevice() {
    var detector = new MobileDetect(window.navigator.userAgent);
    this.device_os = detector.os();
    if (detector.phone() !== null) {
      this.browser_is = 'phone';
    } else if (detector.tablet() !== null) {
      this.browser_is = 'tablet';
    } else {
      this.browser_is = 'pc';
    }
    this.shareDataService.setDetectDevice({ browser_is: this.browser_is, device_os: this.device_os });
  }
}
