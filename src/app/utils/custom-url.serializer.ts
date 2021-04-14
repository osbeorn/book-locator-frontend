import {DefaultUrlSerializer, UrlSerializer, UrlTree} from '@angular/router';

export default class CustomUrlSerializer implements UrlSerializer {

  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    // Encode "+" to "%2B"
    url = url.replace(/\+/gi, '%2B');
    // Use the default serializer.
    return this.defaultUrlSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    return this.defaultUrlSerializer.serialize(tree).replace(/\+/gi, '%2B');
  }
}
