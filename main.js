// ==UserScript==
// @name         LinkedIn feed but without recruitment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes cards from your LinkedIn feed when they contain the "recruitment" word.
// @author       Benjamin Delespierre <benjamin.delespierre@gmail.com>
// @match        https://www.linkedin.com/feed/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function is_activity (node) {
        if (! (node instanceof Element)) {
            return false;
        }

        if (node.getAttribute('data-id')?.match(/^urn:li:activity/)) {
            return true;
        }

        if (node.getAttribute('data-urn')?.match(/^urn:li:activity/)) {
            return true;
        }

        return false;
    }

    function is_loaded (node) {
        return node.querySelectorAll('[data-urn="'+(node.getAttribute('data-id') || '---')+'"]').length > 0;
    }

    function should_remove_node (node) {
        // get actor(s) to match job titles
        let actors = node.querySelectorAll('.feed-shared-actor__description');

        for (var actor of actors) {
            if (actor.innerText.match(/(recrui?teu?r|talent acquisition|head hunter)/i)) {
                return true;
            }
        }

        // get activity description(s)
        let descriptions = node.querySelectorAll('.feed-shared-update-v2__description');

        for (var description of descriptions) {
            if (description.innerText.match(/(recrui?te?(ment)?|recrui?teu?r|hiring|besoins rh|job offer)/i)) {
                return true;
            }
        }

        return false;
    }

    function purge_nodes (nodes) {
        for (var node of nodes) {
            // ignore any item that is not an activity
            if (! is_activity(node)) {
                continue;
            }

            // if current node is not loaded yet, wait until it comes into view
            // and then decide wether to purge it or not
            if (! is_loaded(node)) {
                intersection_observer.observe(node)
                continue;
            }

            // remove items that should be removed (duh...)
            if (should_remove_node(node)) {
                node.remove();
            }

            // should we remove or not, a decision has been made for this node
            // and it's no longer necessary to observe it
            intersection_observer.unobserve(node);
        }
    }

    var mutation_observer = new MutationObserver(function (mutations) {
        for (var mutation of mutations) {
            if (mutation.type === 'childList') {
                purge_nodes(mutation.addedNodes);
            }
        }
    });

    var intersection_observer = new IntersectionObserver(function (entries) {
        var visible = [];

        for (var entry of entries) {
            if (entry.isIntersecting) {
                visible.push(entry.target);
            }
        }

        purge_nodes(visible);
    });

    var feed = document.querySelector('[data-id^="urn:li:activity"]').parentNode;

    mutation_observer.observe(feed, {
        characterData: true,
        childList: true
    });

    purge_nodes(feed.querySelectorAll('[data-id^="urn:li:activity"]'));
})();
