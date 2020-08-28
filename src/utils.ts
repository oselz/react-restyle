function removeClass(classes: string, remove: string | string[]) {
    if (typeof remove === 'string') remove = remove.split(' ');
    return (
        classes
            .split(' ')
            .filter(c => !remove.includes(c))
            .join(' ') + ' '
    );
}

export { removeClass };
