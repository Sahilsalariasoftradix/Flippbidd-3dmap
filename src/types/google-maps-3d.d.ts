declare namespace JSX {
    interface IntrinsicElements {
        'gmp-map-3d': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                mode?: string;
                center?: string;
                tilt?: string;
                range?: string;
                heading?: string;
                'zoom-controls'?: string;
            },
            HTMLElement
        >;
        'gmp-marker-3d': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                position?: string;
                altitude?: string;
                'altitude-mode'?: string;
                icon?: string;
                title?: string;
            },
            HTMLElement
        >;
        'gmp-marker-3d-interactive': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                position?: string;
                altitude?: string;
                'altitude-mode'?: string;
                icon?: string;
                title?: string;
                onGmpClick?: (event: Event) => void;
            },
            HTMLElement
        >;
        'gmp-polygon-3d': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                'altitude-mode'?: string;
                'fill-color'?: string;
                'stroke-color'?: string;
                'stroke-width'?: string;
            },
            HTMLElement
        >;
        'gmp-info-window-3d': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                position?: string;
                altitude?: string;
                'altitude-mode'?: string;
                open?: string;
            },
            HTMLElement
        >;
    }
} 