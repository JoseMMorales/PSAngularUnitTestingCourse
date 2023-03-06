import { HeroService } from "./hero.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";
import { MessageService } from "./message.service";

describe("HeroService", () => {
  let mockMessageService;
  let httpTestingControler: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(["add"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService },
      ],
    });

    httpTestingControler = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroService);
  });

  describe("getHero", () => {
    it("should call get with the correct URL", () => {
      //Call getHero()
      service.getHero(4).subscribe(); // Adding subscribe to fire Http call

      //Test that the URL was correct
      const req = httpTestingControler.expectOne("api/heroes/4");

      req.flush({ id: 4, name: "SuperDude", strength: 56 });
      expect(req.request.method).toBe("GET");
      httpTestingControler.verify();
    });
  });
});
