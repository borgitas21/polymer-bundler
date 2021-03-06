import { Analyzer } from 'polymer-analyzer';
import { BundleManifest, BundleStrategy, BundleUrlMapper } from './bundle-manifest';
import { DocumentCollection } from './document-collection';
import { UrlString } from './url-utils';
export * from './bundle-manifest';
export interface Options {
    analyzer?: Analyzer;
    excludes?: UrlString[];
    inlineCss?: boolean;
    inlineScripts?: boolean;
    rewriteUrlsInTemplates?: boolean;
    sourcemaps?: boolean;
    stripComments?: boolean;
    skipUnresolvedImports?: boolean;
    strategy?: BundleStrategy;
    urlMapper?: BundleUrlMapper;
}
export interface BundleResult {
    documents: DocumentCollection;
    manifest: BundleManifest;
}
export declare class Bundler {
    analyzer: Analyzer;
    enableCssInlining: boolean;
    enableScriptInlining: boolean;
    excludes: UrlString[];
    rewriteUrlsInTemplates: boolean;
    sourcemaps: boolean;
    stripComments: boolean;
    skipUnresolvedImports: boolean;
    strategy: BundleStrategy;
    urlMapper: BundleUrlMapper;
    private _overlayUrlLoader;
    constructor(options?: Options);
    /**
     * Given a manifest describing the bundles, produce a collection of bundled
     * documents with HTML imports, external stylesheets and external scripts
     * inlined according to the options for this Bundler.
     *
     * @param manifest - The manifest that describes the bundles to be produced.
     */
    bundle(manifest: BundleManifest): Promise<BundleResult>;
    /**
     * Generates a BundleManifest with all bundles defined, using entrypoints,
     * strategy and mapper.
     *
     * @param entrypoints - The list of entrypoints that will be analyzed for
     *     dependencies. The results of the analysis will be passed to the
     *     `strategy`.
     * @param strategy - The strategy used to construct the output bundles.
     *     See 'polymer-analyzer/src/bundle-manifest'.
     * @param mapper - A function that produces urls for the generated bundles.
     *     See 'polymer-analyzer/src/bundle-manifest'.
     */
    generateManifest(entrypoints: UrlString[]): Promise<BundleManifest>;
    /**
     * Analyze a url using the given contents in place of what would otherwise
     * have been loaded.
     */
    private _analyzeContents(url, contents);
    /**
     * Set the hidden div at the appropriate location within the document.  The
     * goal is to place the hidden div at the same place as the first html
     * import.  However, the div can't be placed in the `<head>` of the document
     * so if first import is found in the head, we prepend the div to the body.
     * If there is no body, we'll just attach the hidden div to the document at
     * the end.
     */
    private _attachHiddenDiv(ast, hiddenDiv);
    /**
     * Produces a document containing the content of all of the bundle's files.
     * If the bundle's url resolves to an existing html file, that file will be
     * used as the basis for the generated document.
     */
    private _bundleDocument(docBundle, bundleManifest);
    /**
     * Creates a hidden container <div> to which inlined content will be
     * appended.
     */
    private _createHiddenDiv();
    /**
     * Append a `<link rel="import" ...>` node to `node` with a value of `url`
     * for the "href" attribute.
     */
    private _createHtmlImport(url);
    /**
     * Given an array of Bundles, remove all files from bundles which are in the
     * "excludes" set.  Remove any bundles which are left empty after excluded
     * files are removed.
     */
    private _filterExcludesFromBundles(bundles);
    /**
     * Given a document, search for the hidden div, if it isn't found, then
     * create it.  After creating it, attach it to the desired location.  Then
     * return it.
     */
    private _findOrCreateHiddenDiv(ast);
    /**
     * Add HTML Import elements for each file in the bundle.  Efforts are made to
     * ensure that imports are injected prior to any eager imports of other
     * bundles which are known to depend on them, to preserve expectations of
     * evaluation order.
     */
    private _injectHtmlImportsForBundle(document, ast, bundle, bundleManifest);
    /**
     * Replace html import links in the document with the contents of the
     * imported file, but only once per url.
     */
    private _inlineHtmlImports(document, ast, bundle, bundleManifest);
    /**
     * Replace all external javascript tags (`<script src="...">`)
     * with `<script>` tags containing the file contents inlined.
     */
    private _inlineScripts(document, ast, bundle, excludes);
    /**
     * Replace all polymer stylesheet imports (`<link rel="import" type="css">`)
     * with `<style>` tags containing the file contents, with internal URLs
     * relatively transposed as necessary.
     */
    private _inlineStylesheetImports(document, ast, bundle, excludes, rewriteUrlsInTemplates);
    /**
     * Replace all external stylesheet references, in `<link rel="stylesheet">`
     * tags with `<style>` tags containing file contents, with internal URLs
     * relatively transposed as necessary.
     */
    private _inlineStylesheetLinks(document, ast, bundle, excludes?, rewriteUrlsInTemplates?);
    /**
     * Old Polymer supported `<style>` tag in `<dom-module>` but outside of
     * `<template>`.  This is also where the deprecated Polymer CSS import tag
     * `<link rel="import" type="css">` would generate inline `<style>`.
     * Migrates these `<style>` tags into available `<template>` of the
     * `<dom-module>`.  Will create a `<template>` container if not present.
     *
     * TODO(usergenic): Why is this in bundler... shouldn't this be some kind of
     * polyup or pre-bundle operation?
     */
    private _moveDomModuleStyleIntoTemplate(style, refStyle?);
    /**
     * When an HTML Import is encountered in the head of the document, it needs
     * to be moved into the hidden div and any subsequent order-dependent
     * imperatives (imports, styles, scripts) must also be move into the
     * hidden div.
     */
    private _moveOrderedImperativesFromHeadIntoHiddenDiv(ast);
    /**
     * Move any remaining htmlImports that are not inside the hidden div
     * already, into the hidden div.
     */
    private _moveUnhiddenHtmlImportsIntoHiddenDiv(ast);
    /**
     * Generate a fresh document (ASTNode) to bundle contents into.
     * If we're building a bundle which is based on an existing file, we
     * should load that file and prepare it as the bundle document, otherwise
     * we'll create a clean/empty html document.
     */
    private _prepareBundleDocument(bundle);
    /**
     * Removes all empty hidden container divs from the AST.
     */
    private _removeEmptyHiddenDivs(ast);
}
