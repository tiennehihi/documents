<div class="example">
    <div class="example-title">{{title}}</div>
    {{#if description}}<div class="example-description">{{description}}</div>{{/if}}
    <div class="example-content well">
        <div class="example-content-widget">
      {{> (lookup . 'content') }}
        </div>
        <button type="button" class="btn btn-link btn-xs example-code-toggle" data-toggle="butt