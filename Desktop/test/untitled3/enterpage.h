#ifndef ENTERPAGE_H
#define ENTERPAGE_H

#include <QMainWindow>

namespace Ui {
class enterpage;
}

class enterpage : public QMainWindow
{
    Q_OBJECT

public:
    explicit enterpage(QWidget *parent = nullptr);
    ~enterpage();

private:
    Ui::enterpage *ui;
};

#endif // ENTERPAGE_H
