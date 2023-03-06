import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

describe("HeroesComponent (integration tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      {
        id: 1,
        name: "Batman",
        strength: 12,
      },
      {
        id: 2,
        name: "Superman",
        strength: 42,
      },
      {
        id: 3,
        name: "Goku",
        strength: 55,
      },
    ];

    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should render each hero an HeroComponent", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    //run ngOnInit
    fixture.detectChanges();

    const heroComponent = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    expect(heroComponent.length).toEqual(3);
    heroComponent.forEach((_hero, i) => {
      expect(heroComponent[i].componentInstance.hero).toEqual(HEROES[i]);
    });
  });

  it("Should call heroService.deleteHero when the Hero Component delete button is clicked", () => {
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    heroComponents[0]
      .query(By.css("button"))
      .triggerEventHandler("click", { stopPropagation: () => {} });

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it("Should call in Child Component heroService.deleteHero when delete button is clicked", () => {
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });
});
