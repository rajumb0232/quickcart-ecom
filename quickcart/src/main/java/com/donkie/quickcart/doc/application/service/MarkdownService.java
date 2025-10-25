package com.donkie.quickcart.doc.application.service;

import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.util.ast.Node;
import com.vladsch.flexmark.util.data.MutableDataSet;
import com.vladsch.flexmark.ext.tables.TablesExtension;
import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension;
import com.vladsch.flexmark.ext.autolink.AutolinkExtension;
import com.vladsch.flexmark.ext.gfm.tasklist.TaskListExtension;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class MarkdownService {

    private final Parser parser;
    private final HtmlRenderer renderer;

    public MarkdownService() {
        MutableDataSet options = new MutableDataSet();

        // Enable GitHub Flavored Markdown extensions
        options.set(Parser.EXTENSIONS, Arrays.asList(
                TablesExtension.create(),           // Tables support
                StrikethroughExtension.create(),    // ~~strikethrough~~
                AutolinkExtension.create(),          // Auto-convert URLs to links
                TaskListExtension.create()           // - [ ] task lists
        ));

        // Build parser and renderer
        this.parser = Parser.builder(options).build();
        this.renderer = HtmlRenderer.builder(options).build();
    }

    /**
     * Convert Markdown string to HTML string
     * @param markdown The Markdown content
     * @return HTML string
     */
    public String convertToHtml(String markdown) {
        if (markdown == null || markdown.trim().isEmpty()) {
            return "";
        }

        // Parse Markdown to document tree
        Node document = parser.parse(markdown);

        // Render document tree to HTML
        return renderer.render(document);
    }
}
