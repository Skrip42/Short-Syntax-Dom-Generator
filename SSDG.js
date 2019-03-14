"use strict";
/**
 * ShortSyntaxDomGenerator
 *
 * object to create dom element
 *
 * @tutorial 
 *  //create new element by element
 *  element = SSDG.create('div')         //create new element from tag or
 *                                       //convert dom element to SSDG element
 *                .class('someClass')    //append class
 *                .id('someId')          //append id
 *                .attr('name', 'value') //append attr
 *                .html('someHtml')      //change html
 *                .append('element')     //append SSDG element of DOM element
 *  //create new element by js object of json
 *  element = SSDG.parse(  
 *      {
 *          id : 'testId',                  // id of element
 *          class : 'testClass',            // class of element
 *          'data-data' : 'testData',       //some attribyte
 *          content : [                     //inner content
 *              {                           //other element
 *                 tagName : 'p',           //set element type (default - div)
 *                 content : 'text content' //text content
 *              }
 *          ]
 *      }
 *  )
 *  //getting result
 *  element.getDOM()             //get dom element
 *  element.getHTML()            //get html
 *  element.appendTo(domElement) //append element to domElement
 *
 */
var SSDG = function () {
    /**
     * strategy manager for parset
     */
    function parserStrategyManager () {
        /**
         * create and add strategy to strategyCollection
         *
         * @param string   name         name of strategy
         * @param function evalFunction eval function of strategy
         */
        this.addStrategy = function (name, evalFunction) {
            this.strategyCollection[name] 
                = new this.strategy(name, evalFunction);
        },

        /**
         * get strategy by name
         *
         * @param string name name of strategy
         *
         * @return object
         */
        this.getStrategy = function (name) {
            if (!name) {
                return this.strategyCollection.content;
            }
            if (!this.strategyCollection[name]) {
                this.addStrategy(name);
            }
            return this.strategyCollection[name];
        },

        /** strategy storage */
        this.strategyCollection = {},

        /**
         * Strategy constructor
         *
         * @param string   name         name of strategy
         * @Param function evalFunction eval function of strategy
         */
        this.strategy = function (name, evalFunction) {
            this.name = name;
            if (evalFunction) {
                this.eval = evalFunction;
            }
        }

        /**
         * Strategy prototype function eval()
         *
         * @param SSDGElement element to parsing
         * @param mixed       value   strategy data
         */
        this.strategy.prototype.eval = function (element, value) {
            element.attr(this.name, value);
        };
    }

    /**
     * Parser
     *
     * convert js object or json to SSDGElement
     */
    var parser = {

        /**
         * main parser function
         *
         * @param object object to parsing
         *
         * @return SSDGElement
         */
        parse : function (object) {
            if (!object.tagName) {
                object.tagName = 'div';
            }
            var element = ssdg.create(object.tagName);
            delete object.tagName;
            var key;
            for (key in object) {
                this.strategyManager.getStrategy(key).eval(element, object[key]);
            }
            return element;
        },
        /** parserStrategyManager instance*/
        strategyManager : new parserStrategyManager(),
    }

    /** the class strategy */
    parser.strategyManager.addStrategy('class', function (element, value) {
        element.class(value);
    });

    /** the id strategy */
    parser.strategyManager.addStrategy('id', function (element, value) {
        element.id(value);
    });
    
    /** the content strategy */
    parser.strategyManager.addStrategy('content', function (element, value) {
        if (typeof value === 'string') {
            element.append(document.createTextNode(value));
        } else if (Array.isArray(value)) {
            var i = 0;
            for (i = 0; i < value.length; i++) {
                this.eval(element, value[i]);
            }
        } else if (typeof value === 'object') {
            element.append(ssdg.parse(value));
        }
    });
   
    function SSDGElementCollection (elementTag, count) {
        this.tag = elementTag
        this.collection = [];
        this.id = [];
        this.class = [];
        this.attrib = {};
        this.count = count || 0;
    }

    SSDGElementCollection.prototype.setCount(count) {
    }

    SSDGElementCollection.prototype.class(className) {
    }

    SSDGElementCollection.prototype.id(id) {
    }

    SSDGElementCollection.prototype.attr(name, value) {
    }

    SSDGElementCollection.prototype.html(string) {
    }

    SSDGElementCollection.prototype.append(element) {
    }

    SSDGElementCollection.prototype.getHTML() {
    }

    SSDGElementCollection.prototype.getList() {
    }

    SSDGElementCollection.prototype.getDOM() {
    }

    /**
     * SSDGElement constructor
     *
     * @param string|HTMLElement element string or dom element co create
     */
    function SSDGElement (element) {
        if (typeof tagName === 'string') {
            this.element = document.createElement(tagName);
        } else if (element instanceof HTMLElement) {
            this.element = element;
        }
    };

    /**
     * SSDGElement.getDOM() function
     *
     * @return HTMLElement
     */
    SSDGElement.prototype.getDOM = function () {
        return this.element;
    };

    /**
     * SSDGElement.class() function
     *
     * appending class to element
     *
     * @param string|array className class or classes to append
     *
     * @return this
     */
    SSDGElement.prototype.class = function (className) {
        if (Array.isArray(className)) {
            var i = 0;
            for (i = 0; i < className.length; i++) {
                this.class(className[i]);
            }
        } else {
            this.element.classList.add(className);
        }
        return this;
    };

    /**
     * SSDGElement.id() function
     *
     * appending id to element
     *
     * @param int id id to append
     *
     * @return this
     */
    SSDGElement.prototype.id = function (id) {
        this.element.id = id;
        return this;
    };

    /**
     * SSDGElement.attr() function
     *
     * appending attribute to element
     *
     * @param string name  name of attribute
     * @param string value value of attribute
     *
     * @return this
     */
    SSDGElement.prototype.attr = function (name, value) {
        this.element.setAttribute(name, value);
        return this;
    };


    /**
     * SSDGElement.html() function
     *
     * add inner html to element
     *
     * @param string content inner html string to element
     *
     * @return this
     */
    SSDGElement.prototype.html = function (content) {
        this.element.innerHTML = content;
        return this;
    };

    /**
     * SSDGElement.append() function
     *
     * add child element to element
     *
     * @param HTMLElement|SSDGElement subElement adding as child
     *
     * @return this
     */
    SSDGElement.prototype.append = function (subElement) {
        if (subElement instanceof element) {
            this.element.appendChild(subElement.getDOM());
        } else {
            this.element.appendChild(subElement);
        }
        return this;
    };

    /**
     * SSDGElement.getHTML() function
     *
     * return inner html of element
     *
     * @return string
     */
    SSDGElement.prototype.getHTML = function () {
        var temp = document.createElement('div');
        temp.appendChild(this.element);
        return temp.innerHTML;
    };

    /**
     * SSDGElement.appendTo() function
     *
     * append element to domElement
     *
     * @param HTMLElement domElement target dom element
     */
    SSDGElement.prototype.appendTo = function (domElement) {
        return domElement.appendChild(this.getDOM());
    };
    
    return {
        /**
         * create new SSDGElement
         *
         * @param string|HTMLElement tagName
         *
         * @return SSDGElement
         */
        create : function (tagName) {
            return new element(tagName);
        },
        /**
         * create new SSDGElement from object
         *
         * @param object object
         *
         * @return SSDGElement
         */
        parse : function (object) {
            return parser.parse(object);
        },
    }
} ()
