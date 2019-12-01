import { Observable, of, from, fromEvent, concat, Subscriber, interval, throwError, timer, zip } from "rxjs";
import { allBooks, allReaders } from "./data";
import { ajax, AjaxResponse } from "rxjs/ajax";
import {
    map, filter, mergeMap, tap, catchError, take, takeUntil, flatMap
} from "rxjs/operators";
import * as $ from 'jquery'


//#region
// let allBookObservable$ = Observable.create(subscriber => {
//   if (document.title !== "RxBookTracker")
//     subscriber.error("Incorrect page title");

//   for (let book of allBooks) {
//     subscriber.next(book);
//   }

//   setTimeout(() => subscriber.complete(), 2000);

//   return () => console.log('Observable is over');
// });

// allBookObservable$.subscribe(book => console.log(book.title));

// let source1$ = of("Hello", 10, true, allReaders[0].name); // useful when creating an observable from data you already have
// // source$.subscribe(value => console.log(value));

// let source2$ = from(allBooks);
// // source2$.subscribe(book => console.log(book));

// concat(source1$, source2$)
// .subscribe(values => console.log(values)); // values are ordered from the first observable to the second observable

// let button = document.querySelector("#readersButton");

// fromEvent(button, "click")
//     .subscribe(event => {
//         console.log(event);
//         let readersDiv = document.querySelector('#readers');
//         for (let reader of allReaders) {
//             readersDiv.innerHTML += reader.name + '<br>';
//         }
//     });

// let button = document.querySelector("#readersButton");

// fromEvent(button, "click")
//    .subscribe(event => {
//       ajax('/api/readers')
//          .subscribe(AjaxResponse => {
//             console.log(AjaxResponse);
//             let readers = AjaxResponse.response;
//             let readersDiv = document.querySelector('#readers');
//             for (let reader of readers) {
//                readersDiv.innerHTML += reader.name + '<br>';
//             }
//          })
//    });
//#endregion

//#region subscribing with observers
// let books$ = from(allBooks);

// let booksObserver = {
//    next: book => console.log(`Title: ${book.title}`),
//    error: err => console.log(`ERROR: ${err}`),
//    complete: () => console.log(`All done.`)
// };

// books$.subscribe(
//    null,
//    null,
//    () => console.log(`All done.`)
// );
//#endregion

//#region multiple observers observing the same observable 
// let currentTime$ = new Observable((subscriber: Subscriber<string>) => {
//    const timeString = new Date().toLocaleTimeString();
//    subscriber.next(timeString);
//    subscriber.complete();
// });

// currentTime$.subscribe(
//    currentTime => console.log(`Observer 1: ${currentTime}`)
// );

// setTimeout(() => {
//    currentTime$.subscribe(
//       currentTime => console.log(`Observer 2: ${currentTime}`)
//    );
// }, 1000);

// setTimeout(() => {
//    currentTime$.subscribe(
//       currentTime => console.log(`Observer 3: ${currentTime}`)
//    );
// }, 2000);



//#endregion

//#region unsubscribe
// let button = document.querySelector("#timerButton");
// let timesDiv = document.querySelector("#times");

// // let timer$ = interval(1000);
// let timer$: Observable<number> = Observable.create((subscriber: Subscriber<number>) => {
//    let i = 0;
//    let intervalID = setInterval(() => {
//       subscriber.next(i++);
//    }, 1000);

//    return () => {
//       console.log('Executing teardown code.');
//       clearInterval(intervalID);
//    }
// });

// let timerSubscription = timer$.subscribe(
//    value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
//    null,
//    () => console.log('All Done')
// );

// let timerConsoleSubscription = timer$.subscribe(
//    value => console.log(`${new Date().toLocaleTimeString()} (${value})`)
// )

// timerSubscription.add(timerConsoleSubscription);
// timerSubscription.add(() => console.log('my add-on teardown'));





// fromEvent(button, 'click').subscribe(
//    event => timerSubscription.unsubscribe()
// );
//#endregion


// let source$ = of(1, 2, 3, 4, 5);
// source$.pipe(
//    map(value => value * 2),
//    filter(mappedValue => mappedValue > 5)
// ).subscribe(
//    finalResult => console.log(finalResult));

//#region  operators
// ajax('/api/errors/500')
//    .pipe(
//       mergeMap((ajaxResponse: AjaxResponse) => ajaxResponse.response),
//       filter(book => book.publicationYear < 1950),
//       tap(oldBook => console.log(`Title: ${oldBook.title}`)),
//       // catchError(err => of({ title: 'Corduroy', author: 'Don Freeman' }))
//       // will handle all errors produced by any operator and return new observable.
//       // in this case, the error call back will not be called
//       // catchError((err, caught) => caught)
//       // catchError(err => { throw `Something bad happened ${err.message}` })
//       catchError(err => throwError(err.message))
//    ).subscribe(
//       finalValue => console.log(`VALUE: ${finalValue}`),
//       error => console.log(`ERROR: ${error}`)
//    );
//#endregion

//#region take
// let button = document.querySelector("#timerButton");
// let timesDiv = document.querySelector("#times");

// let timer$ = interval(1000);
// let timer$: Observable<number> = Observable.create((subscriber: Subscriber<number>) => {
//    let i = 0;
//    let intervalID = setInterval(() => {
//       subscriber.next(i++);
//    }, 1000);

//    return () => {
//       console.log('Executing teardown code.');
//       clearInterval(intervalID);
//    }
// });

// let cancelTimer$ = fromEvent(button, "click");
//  .subscribe(event => {
//      console.log(event);
//      let readersDiv = document.querySelector('#readers');
//      for (let reader of allReaders) {
//          readersDiv.innerHTML += reader.name + '<br>';
//      }
//  });

// timer$.pipe(
//       takeUntil(cancelTimer$)
//    )
//    .subscribe(
//       value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
//       null,
//       () => console.log('All Done!')
//    );
//#endregion


//#region custom operators
// function grabAndLogClassics(year, log) {
//    return (source$: Observable<any>) => {
//       return Observable.create((subscriber: Subscriber<any>) => {
//          return source$.subscribe(
//             book => {
//                if (book.publicationYear < year) {
//                   subscriber.next(book);
//                   if (log) {
//                      console.log(`Classic: ${book.title}`);
//                   }
//                }
//             },
//             error => subscriber.error(error),
//             () => subscriber.complete())

//       })
//    }
// }

// function grabClassics(year) {
//    return filter(book => book.publicationYear < year);
// }

// function grabAndLogClassicsWithPipe(year, log) {
//    return source$ => source$.pipe(
//       filter(book => book.publicationYear < year),
//       tap(classicBook => log ? console.log(`Title: ${classicBook.title}`) : null)
//    )
// }

// ajax('/api/books')
//    .pipe(
//       flatMap((ajaxResponse: AjaxResponse) => ajaxResponse.response),
//       // grabAndLogClassics(1950, true)
//       // grabClassics(1950)
//       grabAndLogClassicsWithPipe(1930, true)
//    ).subscribe(
//       finalValue => console.log(`VALUE: ${finalValue.title}`),
//       error => console.log(`ERROR: ${error}`)
//    );
//#endregion


//#region testing
// let myObservable$ = of({});
// let h = myObservable$.subscribe();

// let mouseMoves = fromEvent(document, 'mousemove');

// let subscribtion = mouseMoves.forEach(e => console.log(e),
// );
// mouseMoves.pipe(
//    tap()
// )
// subscribtion.
//#endregion

//#region Exercise 1
// var keypresses$ = fromEvent(document.querySelector("#textbox"), 'keypress');
// keypresses$.subscribe(e => console.log(e));

// // keypresses$.subscribe({

// // })

// function searchWikipedia(term) {
//     var url = 'http://en.wikipedia.org/w/ap1.php?action=opensearch&format=json&search=' +
//         encodeURIComponent(term) + '&callback=?';

//     // $.ajax(url, data => console.log(data));

//     // ajax(url).pipe(
//     //     take(1),
//     //     map((value: AjaxResponse) => value.response)
//     // ).subscribe(
//     //     value => console.log(value)
//     // )
// }

// function getWikipediaSearchResults(term: string): Observable<string> {
//     return new Observable((subscriber: Subscriber<string>) => {
//         var cancelled = false;
//         var url = 'http://en.wikipedia.org/w/ap1.php?action=opensearch&format=json&search=' +
//             encodeURIComponent(term) + '&callback=?';
//         if(!cancelled)
//         $.ajax(url, data => {
//             subscriber.next(data[1]);
//             subscriber.complete();
//         });

//         return () => cancelled = true;
//     })
// }

// getWikipediaSearchResults('g').pipe(
//     Do
//     map((v, i)=> v)
// )


// searchWikipedia('Terminator');
// buttonClicks$.pipe(
//     take(1),
//     zi
// ).subscribe(next => {
//     alert('button clicked!');
// });
//#endregion

//#region Exercise 1
// var button = document.querySelector('#button');

// function MyObservable(subscribe: Function) {
//     this._subscribe = subscribe;
//     this.type;
// }

// MyObservable.fromEvent = (dom: Element, eventName) => {
//     return new MyObservable((subscriber) => {
//         this.type = 'fromEvent';
//         var handler = (e) => subscriber.next(e);

//         dom.addEventListener(eventName, handler);

//         return {
//             unsubscribe() {
//                 console.log('unsubscribed!');
//                 dom.removeEventListener(eventName, handler)
//             }
//         };
//     })
// }

// MyObservable.prototype = {
//     subscribe(next, error, complete) {
//         if (typeof next === 'function') {
//             return this._subscribe({
//                 next: next,
//                 error: error || (() => { }),
//                 complete: complete || (() => { })
//             })
//         } else {
//             return this._subscribe(next);
//         }
//     },
//     map(projectionFunction) {
//         // returns new filtered observable
//         return new MyObservable((subscriber) => {
//             this.type = 'map';
//             return this.subscribe(
//                 x => subscriber.next(projectionFunction(x)),
//                 err => subscriber.error(err),
//                 () => subscriber.complete()
//             )
//         })
//     },
//     filter(testFunction: (input: any) => boolean) {
//         return new MyObservable((subscriber) => {
//             this.type = 'filter';
//             return this.subscribe({
//                 next: (x) => {
//                     if (testFunction(x))
//                         subscriber.next(x);
//                 },
//                 err: (err) => subscriber.error(err),
//                 complete() {
//                     subscriber.complete();
//                 }
//             })
//         })
//     },
//     take(number: number) {
//         return new MyObservable((subscriber) => {
//             this.type = 'take';
//             let counter = 0;
//             let subscription = this.subscribe(
//                 (x) => {
//                     subscriber.next(x);
//                     if (number >= ++counter) {
//                         subscriber.complete();
//                         subscription.unsubscribe()
//                     }
//                 },
//                 (err) => subscriber.error(err),
//                 () => subscriber.completed()
//             );

//             return subscription;
//         })
//     }
// }

// debugger;
// var clicks = MyObservable.fromEvent(button, 'click')
//     .map(x => x.pageX)
//     .filter(x => x > 20)
//     .take(1)
//     .test()
//     .subscribe(x => console.log(x));

// clicks.unsubscribe();

//#endregion
//#region Exercise 1
class MyObservable {
    _subscribe;
    constructor(subscribe) {
        this._subscribe = subscribe
    }

    subscribe(subscriber) {
        return this._subscribe(subscriber);
    }

    static timeout(time) {
        return new MyObservable(subscriber => {
            let handler = () => {
                subscriber.next();
                subscriber.complete();
            }
            let timer = setTimeout(handler, time);

            return () => clearTimeout(timer);
        })
    }

    static fromEvent(dom: Element, eventName) {
        return new MyObservable(subscriber => {
            const handler = (e) => subscriber.next(e);
            dom.addEventListener(eventName, handler);
            return () => dom.removeEventListener(eventName, handler);
        })
    }

    static allNumbers() {
        return new MyObservable(subscriber => {
            for (let num = 0; ; num++)
                subscriber.next(num);
        })
    }

    map(projectionFunction: (input: any) => any) {
        return new MyObservable(subscriber => {
            return this.subscribe({
                next: (v) => subscriber.next(projectionFunction(v)),
                err() { subscriber.error() },
                complete() { subscriber.complete() }
            })
        })
    }

    filter(testFunction: (input: any) => boolean) {
        return new MyObservable(subscriber => {
            return this.subscribe({
                next(v) {
                    if (testFunction(v))
                        subscriber.next(v);
                },
                error(err) {
                    subscriber.error(err)
                },
                complete() {
                    subscriber.complete();
                }
            })
        })
    }

    static concat(...observables) {
        return new MyObservable(subscriber => {
            let myObservables = observables.slice();
            let currentSubscription;
            let processObservable = () => {
                if (myObservables.length) {
                    let observable = myObservables.shift();
                    currentSubscription = observable.subscribe({
                        next(v) {
                            subscriber.next(v);
                        },
                        error(err) {
                            subscriber.error(err);
                            currentSubscription(); // unsubscribing 
                        },
                        complete() {
                            processObservable();
                        }
                    });
                } else {
                    subscriber.complete();
                }
            }

            processObservable();
            return () => currentSubscription();
        })
    }

    retry(number: number) {
        let count = 0;
        return new MyObservable(subscriber => {
            let subscription;
            let retrySubscribe = () => {
                subscription = this.subscribe({
                    next(v) {
                        subscriber.next(v)
                    },
                    error(err) {
                        if (count++ <= number) {
                            retrySubscribe();
                        }
                        else
                            subscriber.error(err)
                    },
                    complete() {
                        subscriber.complete();
                    }
                })
            }

            retrySubscribe();
            return () => subscription(); // unsubscribing
        });
    }
}

const button = document.querySelector('#button');
const clicks$ = MyObservable.fromEvent(button, 'click');

clicks$
    .map(x => x.pageX)
    .filter(pageX => pageX > 10)
    .subscribe({
        next(v) { console.log(v) },
        error(err) { console.log(err) },
        complete() { console.log('completed') }
    })
// const obs = MyObservable.timeout(500);
// obs.subscribe({
//     next(v) {
//         console.log('next');
//     },
//     complete() {
//         console.log('done');
//     }
// });
//#endregion
//#region Exercise 1

//#endregion
