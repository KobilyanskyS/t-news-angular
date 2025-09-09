import { UrlSegment, Route, UrlSegmentGroup, UrlMatchResult } from '@angular/router';

export function userIdMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route
): UrlMatchResult | null {
  const segment = segments[0];
  if (segment && /^[0-9]+$/.test(segment.path)) {
    return {
      consumed: [segment],
      posParams: {
        user_id: segment
      }
    };
  }
  return null;
}