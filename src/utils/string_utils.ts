class StringUtils {
  // Unaccent string
  public static toSearchString(search: string): string {
    search = search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    search = search.replace(/\s+/g, ' | ').replace(/\b\w+\b/g, '$&:*');
    return search;
  }
}

export default StringUtils;